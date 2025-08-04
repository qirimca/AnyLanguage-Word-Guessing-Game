// Файл: src/components/KeyboardHandler.tsx
// Компонент для обробки фізичної клавіатури з підтримкою кримськотатарських літер

import { useEffect } from 'react'
import { ORTHOGRAPHY_LETTERS } from '../constants/orthography'

interface KeyboardHandlerProps {
  onChar: (letter: string) => void
  onDelete: () => void
  onEnter: () => void
  isRevealing?: boolean
  isGameWon?: boolean
  isGameLost?: boolean
}

// Мапінг клавіш для кримськотатарських літер
const CRIMEAN_TATAR_KEY_MAPPING: { [key: string]: string } = {
  // Основні літери які є і в латинській розкладці
  'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f',
  'g': 'g', 'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm',
  'n': 'n', 'o': 'o', 'p': 'p', 'q': 'q', 'r': 'r', 's': 's',
  't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
  
  // Спеціальні кримськотатарські літери через Alt+клавіша
  'i': 'i',     // звичайна i
  'I': 'ı',     // dotless i (Alt+I або Shift+i у деяких розкладках)
  
  // Комбінації клавіш для спеціальних символів
  // Alt+G для ğ, Alt+U для ü, тощо
  'Alt+g': 'ğ',
  'Alt+u': 'ü',
  'Alt+n': 'ñ',
  'Alt+s': 'ş',
  'Alt+o': 'ö',
  'Alt+c': 'ç',
  'Alt+a': 'â',

  // Також підтримуємо варіанти з AltGr
  'AltGraph+g': 'ğ',
  'AltGraph+u': 'ü',
  'AltGraph+n': 'ñ',
  'AltGraph+s': 'ş',
  'AltGraph+o': 'ö',
  'AltGraph+c': 'ç',
  'AltGraph+a': 'â',

  // Варіанти з Shift+Alt
  'Shift+Alt+g': 'ğ',
  'Shift+Alt+u': 'ü',
  'Shift+Alt+n': 'ñ',
  'Shift+Alt+s': 'ş',
  'Shift+Alt+o': 'ö',
  'Shift+Alt+c': 'ç',
  'Shift+Alt+a': 'â',
  'Shift+Alt+i': 'ı', // dotless i
}

// Альтернативні комбінації для dotless i
const DOTLESS_I_COMBINATIONS = [
  'Alt+i',
  'AltGraph+i', 
  'Shift+Alt+i',
  'Ctrl+Alt+i'
]

export const KeyboardHandler: React.FC<KeyboardHandlerProps> = ({
  onChar,
  onDelete,
  onEnter,
  isRevealing = false,
  isGameWon = false,
  isGameLost = false
}) => {
  
  useEffect(() => {
    // Функція для створення ключа комбінації
    const getKeyCombo = (event: KeyboardEvent): string => {
      const modifiers = []
      if (event.ctrlKey) modifiers.push('Ctrl')
      if (event.altKey) modifiers.push('Alt')
      if (event.shiftKey) modifiers.push('Shift')
      if (event.getModifierState('AltGraph')) modifiers.push('AltGraph')
      
      const key = event.key.toLowerCase()
      if (modifiers.length > 0) {
        return `${modifiers.join('+')}+${key}`
      }
      return key
    }
    
    // Функція для перевірки чи є літера в кримськотатарському алфавіті
    const isValidCrimeanTatarLetter = (letter: string): boolean => {
      return ORTHOGRAPHY_LETTERS.includes(letter.toLowerCase())
    }
    
    // Обробник натискання клавіш
    const listener = (event: KeyboardEvent) => {
      // Не обробляємо події під час показу результатів або завершеної гри
      if (isRevealing || isGameWon || isGameLost) {
        return
      }
      
      // Не обробляємо, якщо користувач вводить в input поле
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }
      
      const keyCombo = getKeyCombo(event)
      
      // Спеціальні клавіші
      if (event.code === 'Backspace') {
        event.preventDefault()
        onDelete()
        return
      }
      
      if (event.code === 'Enter') {
        event.preventDefault()
        onEnter()
        return
      }
      
      // Перевіряємо комбінації для кримськотатарських літер
      if (CRIMEAN_TATAR_KEY_MAPPING[keyCombo]) {
        event.preventDefault()
        const letter = CRIMEAN_TATAR_KEY_MAPPING[keyCombo]
        if (isValidCrimeanTatarLetter(letter)) {
          onChar(letter)
        }
        return
      }
      
      // Звичайні літери
      const letter = event.key.toLowerCase()
      
      // Спеціальна обробка для dotless i
      if (letter === 'i' && (event.altKey || event.getModifierState('AltGraph'))) {
        event.preventDefault()
        onChar('ı') // dotless i
        return
      }
      
      // Перевіряємо чи це допустима літера
      if (letter.length === 1 && letter >= 'a' && letter <= 'z') {
        if (isValidCrimeanTatarLetter(letter)) {
          event.preventDefault()
          onChar(letter)
        }
      }
      
      // Підтримка прямого вводу кримськотатарських літер (якщо клавіатура налаштована)
      if (event.key.length === 1 && isValidCrimeanTatarLetter(event.key)) {
        event.preventDefault()
        onChar(event.key.toLowerCase())
      }
    }
    
    // Додаємо слухача подій
    window.addEventListener('keydown', listener)
    
    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [onChar, onDelete, onEnter, isRevealing, isGameWon, isGameLost])
  
  return null // Цей компонент не рендерить нічого
}

// Файл: src/components/KeyboardInstructions.tsx
// Компонент з інструкціями щодо використання клавіатури

import React from 'react'

export const KeyboardInstructions: React.FC = () => {
  return (
    <div className="keyboard-instructions bg-gray-100 p-4 rounded-lg mb-4 text-sm">
      <h3 className="font-bold text-lg mb-2">⌨️ Як вводити кримськотатарські літери:</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">🔤 Основні літери:</h4>
          <ul className="space-y-1">
            <li><code className="bg-gray-200 px-1 rounded">a-z</code> - звичайні літери</li>
            <li><code className="bg-gray-200 px-1 rounded">i</code> - звичайна i</li>
            <li><code className="bg-gray-200 px-1 rounded">q</code> - кримськотатарське q</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">🔣 Спеціальні літери:</h4>
          <ul className="space-y-1">
            <li><code className="bg-gray-200 px-1 rounded">Alt + a</code> → <strong>â</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + i</code> → <strong>ı</strong> (dotless i)</li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + g</code> → <strong>ğ</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + u</code> → <strong>ü</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + n</code> → <strong>ñ</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + s</code> → <strong>ş</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + o</code> → <strong>ö</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + c</code> → <strong>ç</strong></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
        <p className="text-blue-800">
          <strong>💡 Порада:</strong> Якщо у вас налаштована кримськотатарська клавіатура, 
          ви можете вводити літери безпосередньо. Також працюють комбінації з AltGr.
        </p>
      </div>
      
      <div className="mt-3 p-3 bg-green-50 rounded border-l-4 border-green-400">
        <p className="text-green-800">
          <strong>⌨️ Навігація:</strong> Використовуйте <code className="bg-gray-200 px-1 rounded">Backspace</code> для видалення 
          та <code className="bg-gray-200 px-1 rounded">Enter</code> для підтвердження слова.
        </p>
      </div>
    </div>
  )
}

// Файл: src/utils/keyboardUtils.ts
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
  return ORTHOGRAPHY_LETTERS.includes(normalizeText(char.toLowerCase()))
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