import * as target from '@iap/api-types'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const referenceRoot =
  process.env.INSURANCE_UI_REFERENCE_PATH ??
  path.resolve(process.cwd(), '../../../insurance-ui')
const source = fs.readFileSync(
  path.join(referenceRoot, 'src/features/tickets/data/ticket-schema.ts'),
  'utf8'
)
const reference: Record<string, z.ZodType> = {}
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
  if (name !== 'zod') throw new Error(`Unexpected dependency ${name}`)
  return { z }
}, reference)
const id = '550e8400-e29b-41d4-a716-446655440000'

describe('support ticket reference schema acceptance', () => {
  const cases: Record<string, unknown[]> = {
    findSupportTicketsRequestSchema: [
      { query: {} },
      { query: { filters: {} } },
      { query: { filters: {}, page: -2, size: 0, extra: true }, extra: true },
      { query: { filters: { status: ['OPEN'], value: undefined } } },
      { query: { filters: {}, page: 1.5 } },
    ],
    findSupportTicketByIdRequestSchema: [
      { path: { id, extra: true }, extra: true },
      { path: { id: 'bad' } },
    ],
    findSupportTicketMessagesRequestSchema: [
      { path: { ticketId: id }, query: { page: -1, size: -5 } },
      { path: { ticketId: id }, query: {} },
    ],
    createSupportTicketMessageOperationRequestSchema: [
      {
        path: { ticketId: id },
        body: { body: '', internal: true, extra: true },
      },
      { path: { ticketId: id }, body: { body: 'x'.repeat(4001) } },
    ],
    closeSupportTicketRequestSchema: [
      { path: { ticketId: id }, extra: true },
      { path: { ticketId: null } },
    ],
    assignSupportTicketToLatestAssessmentUserRequestSchema: [
      { path: { ticketId: id, extra: 1 } },
    ],
    pageSupportTicketSchema: [
      {},
      { content: null, totalPages: null, extra: 1 },
      {
        content: [
          {
            id: 'non-uuid',
            ownerUserAccount: { id, extra: 1 },
            statusHistory: [{ toStatus: 'CLOSED' }],
          },
        ],
      },
      { content: [{ status: 'UNKNOWN' }] },
    ],
    pageSupportTicketMessageSchema: [
      {},
      { content: null },
      {
        content: [{ senderType: 'SYSTEM', visibility: 'INTERNAL', body: null }],
      },
      { content: [{ senderType: 'INVALID' }] },
    ],
    supportTicketSchema: [
      {},
      { assignmentHistory: null, ownerUserAccount: { id: 'invalid' } },
      {
        lastMessage: { readByUser: false },
        tags: null,
        category: 'PAYMENT',
        extra: 1,
      },
    ],
  }
  for (const [name, inputs] of Object.entries(cases)) {
    it(`matches source acceptance, stripped output and issues for ${name}`, () => {
      const actualSchema = (target as unknown as Record<string, z.ZodType>)[
        name
      ]
      for (const input of inputs) {
        const expected = reference[name].safeParse(input)
        const actual = actualSchema.safeParse(input)
        expect(actual.success).toBe(expected.success)
        if (actual.success && expected.success)
          expect(actual.data).toEqual(expected.data)
        if (!actual.success && !expected.success)
          expect(actual.error.issues).toEqual(expected.error.issues)
      }
    })
  }
  it('preserves the complete Persian tickets locale', () => {
    const sourceLocale = JSON.parse(
      fs.readFileSync(path.join(referenceRoot, 'src/locales/fa.json'), 'utf8')
    )
    const targetLocale = JSON.parse(
      fs.readFileSync('src/shared/i18n/locales/fa/common.json', 'utf8')
    )
    expect(targetLocale.tickets).toEqual(sourceLocale.tickets)
  })
})
