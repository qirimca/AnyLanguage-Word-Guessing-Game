// src/utils/keyboardUtils.ts
// Утилітарні функції для роботи з клавіатурою

import { ORTHOGRAPHY_LETTERS } from '../constants/orthography'

/**
 * Нормалізує введений текст згідно з Unicode NFC
 */
export const normalizeText = (text: string): string => {
  return text.normalize('NFC')
}

/**
 * Перевіряє чи є символ допустимою кримськотатарською літерою
 */
export const isValidCrimeanTatarLetter = (char: string): boolean => {
  const normalized = normalizeText(char.toLowerCase())
  return normalized === 'â' || ORTHOGRAPHY_LETTERS.includes(normalized)
}

/**
 * Конвертує введений текст у формат придатний для гри
 */
export const sanitizeInput = (input: string): string => {
  return normalizeText(input.toLowerCase())
    .split('')
    .filter(isValidCrimeanTatarLetter)
    .join('')
}

/**
 * Мапінг між різними варіантами написання літер
 */
export const LETTER_VARIANTS: { [key: string]: string } = {
  // Варіанти для dotless i
  'i̇': 'i',   // i з крапкою зверху
  'ı': 'ı',   // dotless i

  // Варіанти для інших літер з діакритиками
  'g̃': 'ğ',   // альтернативне позначення ğ
  'ñ': 'ñ',   // n з tilde
  'ç': 'ç',   // c з cedilla
  'ş': 'ş',   // s з cedilla
  'â': 'â',   // a з комбінованим циркумфлексом
  'â': 'â',    // попередньо складена â

  // Нормалізація подвійних діакритиків
  'üü': 'ü',
  'öö': 'ö',
}

/**
 * Нормалізує літеру до стандартного кримськотатарського алфавіту
 */
export const normalizeLetter = (letter: string): string => {
  const normalized = normalizeText(letter.toLowerCase())
  return LETTER_VARIANTS[normalized] || normalized
}
