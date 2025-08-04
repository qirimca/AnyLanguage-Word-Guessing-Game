// src/constants/config.ts

export const CONFIG = {
  // 🔤 Кількість спроб
  tries: 6,
  
  // 📱 Локалізація
  locale: 'crh',
  
  // 🌍 Доступні мови
  availableLangs: ['crh', 'en'],
  
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

  // 🗓️ Початкова дата гри
  startDate: '2021-06-19',

  // 🌐 Налаштування локалізації
  defaultLang: 'crh',
  language: 'Crimean Tatar',

  // 👤 Інформація про автора
  author: 'Unknown',
  authorWebsite: 'https://example.com',

  // 📚 Джерело словника
  wordListSource: 'Unknown',
  wordListSourceLink: 'https://example.com',

  // 📈 Аналітика
  googleAnalytics: '',

  // 🔐 Додаткові налаштування
  escapeSpecialCharacters: false,
  
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
// 📋 Експорт для зручності
export default CONFIG
