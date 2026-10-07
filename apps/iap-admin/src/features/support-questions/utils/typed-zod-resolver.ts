import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldValues, Resolver } from 'react-hook-form'
import type { z } from 'zod'

type ResolverFieldValues<TSchema extends z.ZodTypeAny> =
  z.infer<TSchema> extends FieldValues ? z.infer<TSchema> : FieldValues

export const typedZodResolver = <
  TSchema extends z.ZodTypeAny,
  TFieldValues extends FieldValues = ResolverFieldValues<TSchema>,
>(
  schema: TSchema
): Resolver<TFieldValues> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return zodResolver(schema as any) as unknown as Resolver<TFieldValues>
}
