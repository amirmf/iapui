export function formatJsonText(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    return value
  }
}

export function minifyJsonText(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value))
  } catch {
    return value
  }
}
