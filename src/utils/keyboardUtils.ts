import { ORTHOGRAPHY_LETTERS } from '../constants/orthography'

export const normalizeText = (text: string): string => {
  return text.normalize('NFC')
}

export const isValidCrimeanTatarLetter = (char: string): boolean => {
  return ORTHOGRAPHY_LETTERS.includes(normalizeText(char.toLowerCase()))
}

export const sanitizeInput = (input: string): string => {
  return normalizeText(input.toLowerCase())
    .split('')
    .filter(isValidCrimeanTatarLetter)
    .join('')
}

export const LETTER_VARIANTS: { [key: string]: string } = {
  'i̇': 'i',
  'ı': 'ı',
  'g̃': 'ğ',
  'ñ': 'ñ',
  'ç': 'ç',
  'ş': 'ş',
  'üü': 'ü',
  'öö': 'ö',
}

export const normalizeLetter = (letter: string): string => {
  const normalized = normalizeText(letter.toLowerCase())
  return LETTER_VARIANTS[normalized] || normalized
}

