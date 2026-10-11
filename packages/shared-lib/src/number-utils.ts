export function persianToEnglishDigits(input: string): string {
  return input.replace(/[\u06F0-\u06F9]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 48)
  )
}

export function arabicToEnglishDigits(input: string): string {
  return input.replace(/[\u0660-\u0669]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x0660 + 48)
  )
}

export function numWithComma(
  value: string | number | null | undefined
): string {
  if (value != null && value !== '' && !Number.isNaN(Number(value))) {
    const tmp = Number(value)
    return tmp.toLocaleString('en-US')
  }
  return String(value ?? '')
}

export function onlyNumberValue(text: string): string {
  let tmp = text
  if (tmp.includes(',') || tmp.includes('.')) {
    tmp = tmp.replace(/,/g, '').replace(/\./g, '')
  }
  tmp = persianToEnglishDigits(tmp)
  const number = tmp.match(/\d+/g)
  return number && number.length ? number.join('') : ''
}

const baseNumbers = [
  'صفر',
  'یک',
  'دو',
  'سه',
  'چهار',
  'پنج',
  'شش',
  'هفت',
  'هشت',
  'نه',
  'ده',
  'یازده',
  'دوازده',
  'سیزده',
  'چهارده',
  'پانزده',
  'شانزده',
  'هفده',
  'هجده',
  'نوزده',
]

const tens = [
  '',
  '',
  'بیست',
  'سی',
  'چهل',
  'پنجاه',
  'شصت',
  'هفتاد',
  'هشتاد',
  'نود',
]

const hundreds = [
  '',
  'یکصد',
  'دویست',
  'سیصد',
  'چهارصد',
  'پانصد',
  'ششصد',
  'هفتصد',
  'هشتصد',
  'نهصد',
]

const scaleNames = [
  '',
  'هزار',
  'میلیون',
  'میلیارد',
  'تریلیون',
  'کوادریلیون',
  'کوینتیلیون',
  'سکستیلیون',
  'سپتیلیون',
  'اکتیلیون',
  'نونیلیون',
  'دسیلیون',
]

export type NumericLike = number | string | bigint | null | undefined

interface SanitizedNumber {
  digits: string
  isNegative: boolean
}

function sanitizeNumericInput(value: NumericLike): SanitizedNumber | null {
  if (value === null || value === undefined) return null

  const raw = typeof value === 'bigint' ? value.toString() : String(value)
  const digitNormalized = persianToEnglishDigits(raw)
  const normalized = digitNormalized.replace(/[\s,٬،]/g, '')
  if (!normalized) return null

  const [integerPart] = normalized.split('.')
  if (!integerPart) return null

  const isNegative = integerPart.startsWith('-')
  const digitsOnly = integerPart.replace(/[^0-9]/g, '')
  if (!digitsOnly) return null

  const trimmed = digitsOnly.replace(/^0+/, '')
  return {
    digits: trimmed || '0',
    isNegative,
  }
}

function splitToTriplets(digits: string): string[] {
  const result: string[] = []
  let remainder = digits

  while (remainder.length > 3) {
    result.unshift(remainder.slice(-3))
    remainder = remainder.slice(0, -3)
  }

  if (remainder) {
    result.unshift(remainder)
  }

  return result
}

function convertHundreds(num: number): string {
  if (num === 0) return ''
  if (num < 20) return baseNumbers[num] ?? ''

  const parts: string[] = []
  const hundred = Math.floor(num / 100)
  const remainder = num % 100

  if (hundred) {
    const hundredWord = hundreds[hundred]
    if (hundredWord) parts.push(hundredWord)
  }

  if (remainder) {
    if (remainder < 20) {
      const baseWord = baseNumbers[remainder]
      if (baseWord) parts.push(baseWord)
    } else {
      const ten = Math.floor(remainder / 10)
      const unit = remainder % 10
      const tensWord = tens[ten] ?? ''
      const unitWord = unit ? (baseNumbers[unit] ?? '') : ''

      parts.push(unitWord ? `${tensWord} و ${unitWord}` : tensWord)
    }
  }

  return parts.join(' و ')
}

export function numberToPersianWords(value: NumericLike): string {
  const sanitized = sanitizeNumericInput(value)
  if (!sanitized) return ''
  if (sanitized.digits === '0') return baseNumbers[0] ?? ''

  const chunks = splitToTriplets(sanitized.digits)
  const parts: string[] = []

  chunks.forEach((chunk, index) => {
    const chunkValue = Number(chunk)
    if (!chunkValue) return

    const scaleIndex = chunks.length - index - 1
    const chunkWords = convertHundreds(chunkValue)
    const scaleLabel = scaleNames[scaleIndex] ?? ''

    parts.push(scaleLabel ? `${chunkWords} ${scaleLabel}` : chunkWords)
  })

  const phrase = parts.join(' و ')
  return sanitized.isNegative ? `منفی ${phrase}` : phrase
}
