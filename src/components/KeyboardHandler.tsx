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
  'Alt+a': 'ä',
  
  // Також підтримуємо варіанти з AltGr
  'AltGraph+g': 'ğ',
  'AltGraph+u': 'ü',
  'AltGraph+n': 'ñ',
  'AltGraph+s': 'ş',
  'AltGraph+o': 'ö',
  'AltGraph+c': 'ç',
  'AltGraph+a': 'ä',
  
  // Варіанти з Shift+Alt
  'Shift+Alt+g': 'ğ',
  'Shift+Alt+u': 'ü',
  'Shift+Alt+n': 'ñ',
  'Shift+Alt+s': 'ş',
  'Shift+Alt+o': 'ö',
  'Shift+Alt+c': 'ç',
  'Shift+Alt+a': 'ä',
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
