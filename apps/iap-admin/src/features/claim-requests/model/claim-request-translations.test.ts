import fa from '@shared/i18n/locales/fa/common.json'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const pageSurfaceSections = [
  'title',
  'refresh',
  'columns',
  'filters',
  'ibanStatusValues',
  'status',
  'requestType',
  'aiStatus',
  'actions',
  'messages',
  'confirmations',
  'dialog',
  'validation',
  'bulkDataExtraction',
  'generateAndSendBulk',
  'bulkDelete',
  'bulkStatusChange',
  'extContractIdPlaceholder',
  'extPolicyIdPlaceholder',
  'fetchNewRequests',
] as const

interface TranslationBranch {
  [key: string]: string | TranslationBranch
}

type TranslationValue = string | TranslationBranch

function flattenTranslations(
  value: TranslationValue,
  prefix = ''
): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value }

  return Object.entries(value).reduce<Record<string, string>>(
    (translations, [key, nestedValue]) => ({
      ...translations,
      ...flattenTranslations(nestedValue, prefix ? `${prefix}.${key}` : key),
    }),
    {}
  )
}

function getPageSurfaceTranslations(
  translations: Record<string, TranslationValue>
) {
  return flattenTranslations(
    Object.fromEntries(
      pageSurfaceSections.map((key) => [key, translations[key]])
    ) as Record<string, TranslationValue>
  )
}

function getTranslationValue(
  translations: Record<string, TranslationValue>,
  key: string
): TranslationValue | undefined {
  return key
    .split('.')
    .reduce<TranslationValue | undefined>(
      (value, segment) =>
        value && typeof value !== 'string' ? value[segment] : undefined,
      translations
    )
}

function getFeatureSourceFiles() {
  const featureRoot = path.resolve(process.cwd(), 'src/features/claim-requests')

  return fs
    .readdirSync(featureRoot, { recursive: true })
    .filter(
      (fileName): fileName is string =>
        typeof fileName === 'string' &&
        /\.(?:ts|tsx)$/.test(fileName) &&
        !fileName.endsWith('.test.ts') &&
        !fileName.endsWith('.test.tsx')
    )
    .map((fileName) => path.join(featureRoot, fileName))
}

function getStaticClaimRequestTranslationKeys() {
  const translationKeyPattern = /['"`]claimRequests\.([A-Za-z0-9_.]+)/g

  return [
    ...new Set(
      getFeatureSourceFiles().flatMap((filePath) => {
        const source = fs.readFileSync(filePath, 'utf8')

        return [...source.matchAll(translationKeyPattern)]
          .map((match) => match[1])
          .filter((key) => !key.endsWith('.'))
      })
    ),
  ].sort()
}

function getDynamicTextFilterTranslationKeys() {
  const toolbarPath = path.resolve(
    process.cwd(),
    'src/features/claim-requests/pages/index/components/use-claim-request-filter-groups.ts'
  )
  const toolbarSource = fs.readFileSync(toolbarPath, 'utf8')
  const textFilterConfig = toolbarSource.match(
    /const textFilterConfigs = \[([\s\S]*?)\] as const/
  )?.[1]

  expect(
    textFilterConfig,
    'Unable to locate text filter configuration.'
  ).toBeDefined()

  return [...textFilterConfig!.matchAll(/id: '([A-Za-z0-9]+)'/g)]
    .map((match) => `filters.${match[1]}`)
    .sort()
}

function getRequiredClaimRequestTranslationKeys() {
  return [
    ...new Set([
      ...getStaticClaimRequestTranslationKeys(),
      ...getDynamicTextFilterTranslationKeys(),
    ]),
  ].sort()
}

describe('ClaimRequestsPage Persian translations', () => {
  it('matches the reference page-surface translation closure verbatim', () => {
    const referencePath = path.resolve(
      process.env.INSURANCE_UI_REFERENCE_PATH ??
        path.join(process.cwd(), '../../..', 'insurance-ui'),
      'src/locales/fa.json'
    )

    expect(
      fs.existsSync(referencePath),
      `Missing reference locale at ${referencePath}. Set INSURANCE_UI_REFERENCE_PATH to the insurance-ui repository root.`
    ).toBe(true)

    const reference = JSON.parse(fs.readFileSync(referencePath, 'utf8')) as {
      claimRequests: Record<string, TranslationValue>
    }

    const targetTranslations = getPageSurfaceTranslations(
      fa.claimRequests as Record<string, TranslationValue>
    )
    const referenceTranslations = getPageSurfaceTranslations(
      reference.claimRequests
    )

    expect(referenceTranslations).toMatchObject(targetTranslations)
  })

  it('covers literal translation keys from the source mounted claim-list components', () => {
    const root =
      process.env.INSURANCE_UI_REFERENCE_PATH ??
      path.resolve(process.cwd(), '../../../insurance-ui')
    const reference = JSON.parse(
      fs.readFileSync(path.join(root, 'src/locales/fa.json'), 'utf8')
    ) as Record<string, TranslationValue>
    const sourceFiles = [
      'pages/claim-requests-page.tsx',
      'components/claim-request-columns.tsx',
      'components/claim-request-data-table-toolbar.tsx',
      'components/claim-request-row-actions.tsx',
      'components/claim-request-delete-dialog.tsx',
      'components/claim-request-bulk-delete-dialog.tsx',
      'components/claim-request-bulk-status-change-dialog.tsx',
      'components/claim-request-bulk-core-ai-dialog.tsx',
      'components/claim-request-generate-and-send-bulk-dialog.tsx',
      'components/claim-request-fetch-new-empty-state.tsx',
      'components/claim-request-header-actions/index.tsx',
      'components/claim-request-header-actions/claim-request-document-receipt-button.tsx',
      'components/claim-request-header-actions/claim-request-export-excel-button.tsx',
      'components/claim-request-header-actions/claim-request-inquiry-fanavaran-button.tsx',
      'components/claim-request-row-actions/claim-request-row-actions-assign-to-me-confirm-dialog.tsx',
      'components/claim-request-row-actions/claim-request-row-actions-remove-my-assessment-confirm-dialog.tsx',
    ]
    for (const file of sourceFiles) {
      const source = fs.readFileSync(
        path.join(root, 'src/features/claim-requests', file),
        'utf8'
      )
      for (const [, key] of source.matchAll(
        /['"]((?:claimRequests|common)\.[A-Za-z0-9_.]+)['"]/g
      )) {
        const value = getTranslationValue(reference, key)
        if (value === undefined) continue // Source literal-key fallbacks are asserted separately.
        expect(
          getTranslationValue(
            fa as unknown as Record<string, TranslationValue>,
            key
          ),
          `${file}: ${key}`
        ).toEqual(value)
      }
    }
  })

  it('provides the exact reference value for every static and dynamic mounted key', () => {
    const referencePath = path.resolve(
      process.env.INSURANCE_UI_REFERENCE_PATH ??
        path.join(process.cwd(), '../../..', 'insurance-ui'),
      'src/locales/fa.json'
    )
    const reference = JSON.parse(fs.readFileSync(referencePath, 'utf8')) as {
      claimRequests: Record<string, TranslationValue>
    }
    const target = fa.claimRequests as Record<string, TranslationValue>

    for (const key of getRequiredClaimRequestTranslationKeys()) {
      if (key === 'actions.view' || key === 'messages.docTypeUpdateFailed') {
        expect(
          getTranslationValue(reference.claimRequests, key)
        ).toBeUndefined()
        expect(getTranslationValue(target, key)).toBeUndefined()
        continue
      }
      expect(
        getTranslationValue(target, key),
        `Missing target key: ${key}`
      ).toBeDefined()
      expect(
        getTranslationValue(reference.claimRequests, key),
        `Missing reference key: ${key}`
      ).toBeDefined()
      expect(getTranslationValue(target, key), key).toBe(
        getTranslationValue(reference.claimRequests, key)
      )
    }
  })
})
