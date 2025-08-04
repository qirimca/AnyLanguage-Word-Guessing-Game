// src/hooks/useKeyboardHandler.ts

import { useEffect, useCallback } from 'react'
import { normalizeLetter } from '../constants/config'

// 🗝️ Карта клавіш для кримськотатарської мови
const CRIMEAN_TATAR_KEY_MAP: Record<string, string> = {
  // Стандартні літери
  'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't', 'y': 'y', 'u': 'u', 'o': 'o', 'p': 'p',
  'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g', 'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l',
  'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b', 'n': 'n', 'm': 'm',
  
  // Кримськотатарські спеціальні літери з альтернативними способами введення
  'ı': 'ı', 'i': 'i',           // ı (dotless i) та звичайна i
  'ğ': 'ğ', 'ü': 'ü', 'ñ': 'ñ', // Основні діакритичні літери
  'ş': 'ş', 'ö': 'ö', 'ç': 'ç',  // Інші спеціальні літери
  'ä': 'ä',                      // ä
  
  // Альтернативні способи введення через композитні клавіші
  'АltLeft+i': 'ı',             // Alt+i для ı
  'AltLeft+g': 'ğ',             // Alt+g для ğ
  'AltLeft+u': 'ü',             // Alt+u для ü
  'AltLeft+n': 'ñ',             // Alt+n для ñ
  'AltLeft+s': 'ş',             // Alt+s для ş
  'AltLeft+o': 'ö',             // Alt+o для ö
  'AltLeft+c': 'ç',             // Alt+c для ç
  'AltLeft+a': 'ä',             // Alt+a для ä
}

// 🎯 Тип для обробника клавіш
interface KeyboardHandlerProps {
  onKeyPress: (key: string) => void
  onEnter: () => void
  onBackspace: () => void
  disabled?: boolean
}

// ⌨️ Хук для обробки фізичної клавіатури
export const useKeyboardHandler = ({
  onKeyPress,
  onEnter,
  onBackspace,
  disabled = false
}: KeyboardHandlerProps) => {
  
  // 🔧 Функція обробки натискань клавіш
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Не обробляємо якщо відключено
    if (disabled) return
    
    // Не обробляємо якщо натиснута клавіша модифікатора окремо
    if (event.ctrlKey || event.metaKey) return
    
    const key = event.key.toLowerCase()
    
    // 🔙 Backspace
    if (key === 'backspace') {
      event.preventDefault()
      onBackspace()
      return
    }
    
    // ✅ Enter
    if (key === 'enter') {
      event.preventDefault()
      onEnter()
      return
    }
    
    // 🔤 Обробка літер
    let mappedKey = key
    
    // Перевіряємо комбінації з Alt
    if (event.altKey) {
      const altCombo = `AltLeft+${key}`
      if (CRIMEAN_TATAR_KEY_MAP[altCombo]) {
        mappedKey = CRIMEAN_TATAR_KEY_MAP[altCombo]
      }
    } else if (CRIMEAN_TATAR_KEY_MAP[key]) {
      mappedKey = CRIMEAN_TATAR_KEY_MAP[key]
    }
    
    // Перевіряємо чи це валідна літера для кримськотатарської
    if (isValidCrimeanTatarLetter(mappedKey)) {
      event.preventDefault()
      onKeyPress(normalizeLetter(mappedKey))
    }
  }, [onKeyPress, onEnter, onBackspace, disabled])
  
  // 🎣 Підключаємо обробник подій
  useEffect(() => {
    if (disabled) return
    
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, disabled])
}

// ✅ Перевірка чи є літера валідною для кримськотатарської мови
const isValidCrimeanTatarLetter = (letter: string): boolean => {
  // Кримськотатарський алфавіт
  const crimeanTatarAlphabet = 'abcçdefgğhıijklmnñopqrsştuüvwxyz'
  const normalizedLetter = normalizeLetter(letter)
  
  return crimeanTatarAlphabet.includes(normalizedLetter) && letter.length === 1
}

// 🎨 Компонент-помічник для відображення підказок клавіатури
export const KeyboardHints: React.FC = () => {
  return (
    <div className="keyboard-hints">
      <div className="keyboard-hints__title">
        ⌨️ Фізична клавіатура:
      </div>
      <div className="keyboard-hints__content">
        <div className="keyboard-hints__section">
          <strong>Спеціальні літери:</strong>
          <ul>
            <li><code>Alt + i</code> → ı</li>
            <li><code>Alt + g</code> → ğ</li>
            <li><code>Alt + u</code> → ü</li>
            <li><code>Alt + n</code> → ñ</li>
            <li><code>Alt + s</code> → ş</li>
            <li><code>Alt + o</code> → ö</li>
            <li><code>Alt + c</code> → ç</li>
            <li><code>Alt + a</code> → ä</li>
          </ul>
        </div>
        <div className="keyboard-hints__section">
          <strong>Керування:</strong>
          <ul>
            <li><code>Enter</code> → Надіслати слово</li>
            <li><code>Backspace</code> → Видалити літеру</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default useKeyboardHandler
