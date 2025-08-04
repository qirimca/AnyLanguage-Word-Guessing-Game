// src/constants/config.ts

export const CONFIG = {
  // 🔤 Кількість спроб
  tries: 6,

  // 📅 Дата початку гри
  startDate: 'January 1, 2024 00:00:00',

  // 📊 Google Analytics ID (порожній, якщо не використовується)
  googleAnalytics: '',

  // 🌐 Назва мови
  language: 'Qırımtatarca',

  // 👤 Автор та джерела
  author: "QIRI'M Young",
  authorWebsite: 'https://ctcorpus.org',
  wordListSource: 'Qırımtatar Milliy Korpusu',
  wordListSourceLink: 'https://ctcorpus.org',

  // 🔀 Розширені налаштування
  shuffle: false,
  
  // 📱 Локалізація
  locale: 'crh',
  
  // 🌍 Доступні мови
  availableLangs: ['crh', 'en'],
  defaultLang: 'crh',
  escapeSpecialCharacters: true,
  
  // 🎨 Кольорова палітра для кримськотатарської Wordle
  colors: {
    // Основні кольори інтерфейсу
    primary: '#52494B',     // Темно-сірий для тексту
    background: '#F5F5F5',  // Світло-сірий фон
    
    // Кольори для стану літер
    absent: '#52494B',      // Літера відсутня - темно-сірий
    present: '#FDE61A',     // Літера є, але не на місці - жовтий  
    correct: '#99CEEF',     // Літера на правильному місці - блакитний
    
    // Додатковий акцентний колір
    accent: '#FF955B'       // Помаранчевий для кнопок та акцентів
  },
  
  // ✏️ Шрифт для красивого відображення
  font: {
    family: 'e-Ukraine Head, Arial, sans-serif',
    sizes: {
      title: '2.5rem',
      subtitle: '1.2rem',
      letter: '2rem',
      button: '1rem'
    }
  },
  
  // 🔧 КРИТИЧНО: Unicode нормалізація для кримськотатарської мови
  normalization: 'NFC' as const,
  
  // 📏 Розміри гри
  wordLength: 5,
  
  // ⚙️ Налаштування гри
  settings: {
    animation: {
      flipDelay: 100,    // Затримка анімації перевертання (мс)
      revealDelay: 300   // Затримка розкриття результату (мс)
    },
    
    keyboard: {
      enablePhysical: true,  // Підтримка фізичної клавіатури
      layout: 'crh'         // Розкладка: кримськотатарська
    },
    
    accessibility: {
      highContrast: false,   // Високий контраст
      largeText: false       // Великий шрифт
    }
  },
  
  // 📱 Responsive точки перелому
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
}

// 🛠️ Функції для роботи з Unicode нормалізацією
export const normalizeText = (text: string): string => {
  return text.normalize(CONFIG.normalization)
}

// ✅ Функція для нормалізації введених літер
export const normalizeLetter = (letter: string): string => {
  return letter.normalize(CONFIG.normalization).toLowerCase()
}

// 🔍 Функція для порівняння літер з урахуванням нормалізації
export const compareLetters = (letter1: string, letter2: string): boolean => {
  return normalizeLetter(letter1) === normalizeLetter(letter2)
}

// 📋 Експорт для зручності
export default CONFIG
