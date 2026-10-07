import * as target from '@iap/api-types'
import { supportService } from '@iap/support'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

const client = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock('@iap/api-client', () => ({ getApiClient: () => client }))

const referenceRoot =
  process.env.INSURANCE_UI_REFERENCE_PATH ??
  path.resolve(process.cwd(), '../../../insurance-ui')
const read = (file: string) =>
  fs.readFileSync(path.join(referenceRoot, file), 'utf8')
const load = (source: string, dependencies: Record<string, unknown> = {}) => {
  const exports: Record<string, unknown> = {}
  new Function(
    'require',
    'exports',
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText
  )((name: string) => {
    if (name === 'zod') return { z }
    if (!(name in dependencies))
      throw new Error(`Unexpected dependency ${name}`)
    return dependencies[name]
  }, exports)
  return exports
}
const tickets = load(read('src/features/tickets/data/ticket-schema.ts'))
// Evaluate the actual source enum factory, without evaluating unrelated claim contracts.
const claimSource = ts.createSourceFile(
  'claim.ts',
  read('src/features/claim-requests/data/claim-request-schema.ts'),
  ts.ScriptTarget.Latest,
  true
)
const claimStatus = claimSource.statements.find(
  (statement) =>
    ts.isVariableStatement(statement) &&
    statement.declarationList.declarations.some(
      (declaration) =>
        declaration.name.getText(claimSource) === 'claimRequestStatusSchema'
    )
)
if (!claimStatus) throw new Error('Reference claim status schema is missing')
const claim = load(
  `import { z } from 'zod';\n${claimStatus.getText(claimSource)}`
)
const constantsSource = ts.createSourceFile(
  'constants.ts',
  read('src/constants/tickets-constant.ts'),
  ts.ScriptTarget.Latest,
  true
)
const displayValues = constantsSource.statements.find(
  (statement) =>
    ts.isVariableStatement(statement) &&
    statement.declarationList.declarations.some(
      (declaration) =>
        declaration.name.getText(constantsSource) ===
        'SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES'
    )
)
if (!displayValues)
  throw new Error('Reference input display values are missing')
const constants = load(displayValues.getText(constantsSource))
// Apply only the user-approved content exception before nested schemas are composed.
const flow = load(
  read('src/features/support/data/support-flow-schema.ts').replace(
    'content: z.array(supportOptionSchema).optional()',
    'content: z.array(supportOptionSchema).nullish()'
  ),
  {
    '@/constants/tickets-constant': constants,
    '@/features/claim-requests/data/claim-request-schema.ts': claim,
    '@/features/tickets/data/ticket-schema.ts': tickets,
  }
)
const myIap = load(read('src/features/support/data/my-iap-ticket-schema.ts'))
const sourceSchemas = { ...tickets, ...flow, ...myIap }
const primitiveCases = [
  undefined,
  null,
  '',
  'OPEN',
  'unknown',
  true,
  false,
  0,
  -1,
  1.5,
  [],
  {},
  ['a'],
  [null],
  { unknown: true },
]

function inputs(schema: z.ZodType, depth = 0): unknown[] {
  const definition = schema._zod.def as {
    type: string
    innerType?: z.ZodType
    element?: z.ZodType
    options?: z.ZodType[]
  }
  if (depth > 6) return primitiveCases
  if (definition.innerType) return inputs(definition.innerType, depth + 1)
  if (definition.type === 'object') {
    const shape = (schema as z.ZodObject).shape
    return [
      ...primitiveCases,
      Object.fromEntries(Object.keys(shape).map((key) => [key, null])),
      Object.fromEntries(Object.keys(shape).map((key) => [key, 1.5])),
      ...Object.entries(shape).flatMap(([key, child]) =>
        inputs(child as z.ZodType, depth + 1).map((value) => ({
          [key]: value,
          unknown: true,
        }))
      ),
    ]
  }
  if (definition.type === 'array' && definition.element)
    return [
      ...primitiveCases,
      ...inputs(definition.element, depth + 1).map((value) => [value]),
    ]
  if (definition.type === 'record') {
    const valueType = (schema._zod.def as unknown as { valueType: z.ZodType })
      .valueType
    return [
      ...primitiveCases,
      ...inputs(valueType, depth + 1).map((value) => ({ selected: value })),
    ]
  }
  if (definition.type === 'enum') {
    return [
      ...primitiveCases,
      ...Object.values(
        (schema._zod.def as unknown as { entries: Record<string, string> })
          .entries
      ),
    ]
  }
  if (definition.type === 'union' && definition.options)
    return [
      ...primitiveCases,
      ...definition.options.flatMap((option) => inputs(option, depth + 1)),
    ]
  return primitiveCases
}

describe('fresh exhaustive Support source contract comparison', () => {
  for (const [name, schema] of Object.entries(sourceSchemas)) {
    if (!(schema instanceof z.ZodType)) continue
    it(`matches exported ${name}, nested acceptance/output and issue order`, () => {
      const actualSchema = (target as unknown as Record<string, z.ZodType>)[
        name
      ]
      expect(
        actualSchema,
        `${name} must preserve its public export`
      ).toBeDefined()
      for (const input of inputs(schema)) {
        // Apply the accepted workspace content exception to the source oracle.
        const expectedSchema =
          schema instanceof z.ZodObject && 'content' in schema.shape
            ? schema.extend({ content: schema.shape.content.nullish() })
            : schema
        const expected = expectedSchema.safeParse(input)
        const actual = actualSchema.safeParse(input)
        expect(actual.success, `${name}: ${JSON.stringify(input)}`).toBe(
          expected.success
        )
        if (actual.success && expected.success)
          expect(actual.data).toEqual(expected.data)
        if (!actual.success && !expected.success)
          expect(actual.error.issues).toEqual(expected.error.issues)
      }
    })
  }
})

const referenceService = load(
  read('src/features/support/services/support-service.ts'),
  {
    '@/utils/api-client': { createApiClient: () => client },
    '@/features/support/data/my-iap-ticket-schema': myIap,
    '@/features/support/data/support-flow-schema': flow,
    '@/features/tickets/data/ticket-schema': tickets,
  }
).supportService as typeof supportService
const ticketId = '123e4567-e89b-42d3-a456-426614174000'

describe('all Support operations against actual reference service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client.get.mockResolvedValue({ data: {} })
    client.post.mockResolvedValue({ data: {} })
  })
  const operations: Array<{
    name: keyof typeof supportService
    request: unknown
  }> = [
    {
      name: 'publicAnswer',
      request: {
        userPrompt: '',
        parametersContext: { selected: { extra: 1 } },
        extra: true,
      },
    },
    {
      name: 'myAnswer',
      request: { optionsPage: -1, optionsSize: 0, extra: true },
    },
    {
      name: 'getMyIapTicketById',
      request: { path: { ticketId, extra: true }, extra: true },
    },
    {
      name: 'getMyIapTicketMessages',
      request: {
        path: { ticketId },
        query: { page: -1, size: 0, extra: true },
      },
    },
    {
      name: 'getMyIapTickets',
      request: { query: { filters: { status: 'OPEN', page: 'override' } } },
    },
  ]
  for (const { name, request } of operations) {
    it(`matches ${name} method, path, stripped body/query, signal, credentials and response`, async () => {
      const signal = new AbortController().signal
      const invoke = (service: typeof supportService) =>
        (
          service[name] as (
            request: unknown,
            options: { signal: AbortSignal }
          ) => Promise<unknown>
        )(request, { signal })
      const expected = await invoke(referenceService)
      const expectedGet = [...client.get.mock.calls]
      const expectedPost = [...client.post.mock.calls]
      vi.clearAllMocks()
      const actual = await invoke(supportService)
      expect(client.get.mock.calls).toEqual(expectedGet)
      expect(client.post.mock.calls).toEqual(expectedPost)
      expect(actual).toEqual(expected)
    })
  }
})
