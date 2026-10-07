import { assessmentItemSchema, claimRequestSchema } from '@iap/api-types'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

// Execute trusted local definitions and their true source dependencies. Injecting
// target nested schemas here would hide a divergence in those dependencies.
function loadReferenceModule(relativePath: string): Record<string, unknown> {
  const root =
    process.env.INSURANCE_UI_REFERENCE_PATH ??
    path.resolve(process.cwd(), '../../../insurance-ui')
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  const exports: Record<string, unknown> = {}
  const allowedDependencies: Record<string, string> = {
    '@/features/doc-types/data/doc-type-schema':
      'src/features/doc-types/data/doc-type-schema.ts',
    '@/features/files/data/attachment-schema':
      'src/features/files/data/attachment-schema.ts',
    '@/features/person-special-diseases/data/person-special-disease-schema':
      'src/features/person-special-diseases/data/person-special-disease-schema.ts',
  }
  const requireReferenceDependency = (name: string): unknown => {
    if (name === 'zod') return { z }
    const dependency = allowedDependencies[name]
    if (!dependency) throw new Error(`Unexpected reference dependency: ${name}`)
    return loadReferenceModule(dependency)
  }
  new Function('require', 'exports', compiled)(
    requireReferenceDependency,
    exports
  )
  return exports
}

function loadReferenceSchema() {
  return loadReferenceModule(
    'src/features/claim-requests/data/claim-request-schema.ts'
  ).claimRequestSchema as typeof claimRequestSchema
}

describe('executed reference ClaimRequest schema parity', () => {
  const reference = loadReferenceSchema()
  it('has identical fields and parsed nested output, including stripping and retained unknowns', () => {
    expect(Object.keys(claimRequestSchema.shape)).toEqual(
      Object.keys(reference.shape)
    )
    const fixture = {
      id: 'claim-1',
      unknownBase: 'strip',
      specialDiseases: ['VIP', 'LEVEL_ONE'],
      docType: {
        id: 'doc',
        docType: 'Invoice',
        maxThreshold: 100,
        unknownDoc: 'retain',
      },
      externalDoctor: { doctorCode: '123', unknownDoctor: 'retain' },
      documents: [
        {
          dataJsonSchema: '{}',
          extractedData: { unknown: true },
          unknownDocument: 'retain',
        },
      ],
      attachments: [
        {
          filename: 'x',
          fileType: 'pdf',
          fileSize: 1,
          uploadDate: '2026-10-07',
          minioObjectName: 'x',
          bucketName: 'claim',
          extraAttachment: true,
        },
      ],
      aiAssessmentResults: [
        {
          assessType: 'DUPLICATION',
          resolutionType: 'RETURN',
          extraAi: 'strip',
        },
      ],
      duplicates: [
        {
          type: 'IMAGE',
          extraDuplicate: 'strip',
          duplicatesDetail: [{ duplicateScore: 1, extraDetail: 'strip' }],
        },
      ],
      objections: [{ roleType: 'EXPERT', extraObjection: 'retain' }],
      subInsuredPeople: [{ nationalCode: '123', extraPerson: 'strip' }],
      assignmentHistory: [
        { assignedAt: '2026-10-07', extraAssignment: 'retain' },
      ],
      statusHistory: [{ status: 'APPROVED', extraHistory: 'retain' }],
    }
    expect(claimRequestSchema.parse(fixture)).toEqual(reference.parse(fixture))
  })
  it('matches acceptance and validation issue paths for every field and invalid nested input', () => {
    for (const key of Object.keys(reference.shape)) {
      for (const value of [
        null,
        undefined,
        '',
        0,
        false,
        [],
        {},
        { unknown: true },
      ]) {
        const input = { [key]: value }
        const expected = reference.safeParse(input)
        const actual = claimRequestSchema.safeParse(input)
        expect(actual.success, `${key}: ${JSON.stringify(value)}`).toBe(
          expected.success
        )
        if (!actual.success && !expected.success)
          expect(
            actual.error.issues.map(({ code, path }) => ({ code, path }))
          ).toEqual(
            expected.error.issues.map(({ code, path }) => ({ code, path }))
          )
        if (actual.success && expected.success)
          expect(actual.data).toEqual(expected.data)
      }
    }
  })
})

describe('read-only assessment schema closure', () => {
  it('matches source nested adjustment fields and rejects invalid status', () => {
    const root =
      process.env.INSURANCE_UI_REFERENCE_PATH ??
      path.resolve(process.cwd(), '../../../insurance-ui')
    const text = fs.readFileSync(
      path.join(
        root,
        'src/features/assessment-items/data/assessment-item-schema.ts'
      ),
      'utf8'
    )
    const source =
      "import { z } from 'zod'\n" +
      text.slice(
        text.indexOf('export const assessmentItemStatusSchema'),
        text.indexOf('export const pageAssessmentItemSchema')
      )
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText
    const exports: Record<string, unknown> = {}
    new Function('require', 'exports', compiled)((name: string) => {
      if (name !== 'zod')
        throw new Error(`Unexpected reference dependency: ${name}`)
      return { z }
    }, exports)
    const reference =
      exports.assessmentItemSchema as typeof assessmentItemSchema
    expect(Object.keys(assessmentItemSchema.shape)).toEqual(
      Object.keys(reference.shape)
    )
    const fixture = {
      id: 'item',
      toothType: 'PERMANENT',
      jaw: '1',
      overrideInsuredPersonId: 123,
      extra: true,
      claimRequestAdjustment: {
        status: 'SENT_FAILED',
        adjClaimRequestId: 'adj',
        damageCode: { code: 'D1', extra: true },
        quantity: 2,
        extra: true,
      },
    }
    expect(assessmentItemSchema.parse(fixture)).toEqual(
      reference.parse(fixture)
    )
    for (const status of ['SENT_FAILED', 'PAYMENT_REJECTED', 'INVALID', null]) {
      const input = { claimRequestAdjustment: { status } }
      expect(assessmentItemSchema.safeParse(input).success).toBe(
        reference.safeParse(input).success
      )
    }
  })
})
