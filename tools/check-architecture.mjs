import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const workspaceRoot = process.cwd()
const sourceExtensions = new Set(['.ts', '.tsx'])
const ignoredDirectories = new Set(['dist', 'node_modules', '.vite'])
const reportOnly = process.argv.includes('--report')

const violations = []

const toWorkspacePath = (filePath) => path.relative(workspaceRoot, filePath)

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(
          ...(await collectSourceFiles(path.join(directory, entry.name)))
        )
      }
      continue
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(path.join(directory, entry.name))
    }
  }

  return files
}

async function collectDirectoriesNamed(directory, targetName) {
  const entries = await readdir(directory, { withFileTypes: true })
  const matches = []

  for (const entry of entries) {
    if (!entry.isDirectory() || ignoredDirectories.has(entry.name)) {
      continue
    }

    const entryPath = path.join(directory, entry.name)

    if (entry.name === targetName) {
      matches.push(entryPath)
    }

    matches.push(...(await collectDirectoriesNamed(entryPath, targetName)))
  }

  return matches
}

function addViolation(rule, filePath, detail) {
  violations.push({ detail, filePath: toWorkspacePath(filePath), rule })
}

function getFeatureName(filePath) {
  const segments = toWorkspacePath(filePath).split(path.sep)
  const featureIndex = segments.lastIndexOf('features')

  return featureIndex === -1 ? null : (segments[featureIndex + 1] ?? null)
}

function isModuleFile(filePath) {
  return toWorkspacePath(filePath).split(path.sep).includes('modules')
}

function getImportSpecifiers(source) {
  const importPattern =
    /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['\"]([^'\"]+)['\"]/g
  const dynamicImportPattern = /import\(\s*['\"]([^'\"]+)['\"]\s*\)/g
  const specifiers = []

  for (const pattern of [importPattern, dynamicImportPattern]) {
    for (const match of source.matchAll(pattern)) {
      specifiers.push(match[1])
    }
  }

  return specifiers
}

async function checkLegacyDirectories(applicationSourceRoot) {
  for (const uiDirectory of await collectDirectoriesNamed(
    applicationSourceRoot,
    'ui'
  )) {
    if (toWorkspacePath(uiDirectory) === `packages${path.sep}ui`) {
      continue
    }

    addViolation(
      'no-legacy-ui-directory',
      uiDirectory,
      'Application React components belong in components/.'
    )
  }

  for (const modelDirectory of await collectDirectoriesNamed(
    applicationSourceRoot,
    'model'
  )) {
    for (const childName of ['store', 'context']) {
      const childPath = path.join(modelDirectory, childName)

      try {
        const entries = await readdir(childPath)
        if (entries.length > 0) {
          addViolation(
            'model-must-not-own-client-state',
            childPath,
            'Move client state to context/store or context/provider.'
          )
        }
      } catch {
        // The conventional child does not exist.
      }
    }

    for (const modelFile of await collectSourceFiles(modelDirectory)) {
      const source = await readFile(modelFile, 'utf8')
      const fileName = path.basename(modelFile)

      if (
        /\bfrom\s+['\"]zustand(?:\/|['\"])/.test(source) ||
        /-store\.[tj]sx?$/.test(fileName)
      ) {
        addViolation(
          'model-must-not-own-client-state',
          modelFile,
          'Move Zustand stores to context/store/.'
        )
      }

      if (
        /(?:createContext|<\w+Provider\b)/.test(source) ||
        /-provider\.[tj]sx?$/.test(fileName)
      ) {
        addViolation(
          'model-must-not-own-client-state',
          modelFile,
          'Move React Context definitions and state-owning providers to context/provider/.'
        )
      }

      if (/-table-state\.[tj]sx?$/.test(fileName)) {
        addViolation(
          'model-must-only-contain-data-contracts',
          modelFile,
          'Move table state and route-control adapters to their owning page or query boundary.'
        )
      }
    }
  }
}

async function checkImportBoundaries(sourceRoots) {
  for (const sourceRoot of sourceRoots) {
    for (const sourceFile of await collectSourceFiles(sourceRoot)) {
      const source = await readFile(sourceFile, 'utf8')
      const sourceFeature = getFeatureName(sourceFile)

      for (const specifier of getImportSpecifiers(source)) {
        const featureImport = specifier.match(/^@features\/([^/]+)\/(.+)$/)

        if (featureImport && sourceFeature !== featureImport[1]) {
          addViolation(
            'feature-public-api-only',
            sourceFile,
            `Use @features/${featureImport[1]} instead of ${specifier}.`
          )
        }

        if (isModuleFile(sourceFile) && specifier.startsWith('@features/')) {
          addViolation(
            'modules-must-not-depend-on-features',
            sourceFile,
            `Module code must not import ${specifier}.`
          )
        }

        if (
          toWorkspacePath(sourceFile).startsWith(`packages${path.sep}`) &&
          /^(?:@features\/|@modules\/|@shared\/|@\/features\/|@\/modules\/|@\/shared\/)/.test(
            specifier
          )
        ) {
          addViolation(
            'packages-must-not-depend-on-applications',
            sourceFile,
            `Workspace package code must not import ${specifier}.`
          )
        }
      }
    }
  }
}

const applicationSourceRoots = [
  path.join(workspaceRoot, 'apps/iap-app/src'),
  path.join(workspaceRoot, 'apps/iap-admin/src'),
]
const packageRoot = path.join(workspaceRoot, 'packages')

await Promise.all(
  [...applicationSourceRoots, packageRoot].map(checkLegacyDirectories)
)
await checkImportBoundaries([...applicationSourceRoots, packageRoot])

if (violations.length === 0) {
  console.log('Architecture check passed.')
  process.exit(0)
}

console.error(`Architecture check found ${violations.length} violation(s):`)
for (const violation of violations) {
  console.error(
    `- [${violation.rule}] ${violation.filePath}: ${violation.detail}`
  )
}

if (!reportOnly) {
  process.exitCode = 1
}
