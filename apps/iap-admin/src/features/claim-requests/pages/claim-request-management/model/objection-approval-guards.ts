import type { AssessmentItem } from '@iap/api-types'

export function hasDuplicatedAssessmentItem(
  assessmentItems: AssessmentItem[]
): boolean {
  const seenItemsByDamageCode = new Map<
    string,
    { hasItemWithoutToothNumbers: boolean; toothNumbers: Set<number> }
  >()

  for (const assessmentItem of assessmentItems) {
    const damageCode = assessmentItem.damageCode?.code

    if (!damageCode) {
      continue
    }

    const currentToothNumbers = new Set(assessmentItem.toothNumbers ?? [])

    if (assessmentItem.toothNumber != null) {
      currentToothNumbers.add(assessmentItem.toothNumber)
    }

    const seenItems = seenItemsByDamageCode.get(damageCode)

    if (!seenItems) {
      seenItemsByDamageCode.set(damageCode, {
        hasItemWithoutToothNumbers: currentToothNumbers.size === 0,
        toothNumbers: currentToothNumbers,
      })
      continue
    }

    if (
      seenItems.hasItemWithoutToothNumbers ||
      currentToothNumbers.size === 0
    ) {
      return true
    }

    for (const toothNumber of currentToothNumbers) {
      if (seenItems.toothNumbers.has(toothNumber)) {
        return true
      }

      seenItems.toothNumbers.add(toothNumber)
    }
  }

  return false
}
