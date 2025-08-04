# PowerShell скрипт для автоматичного оновлення кримськотатарської Wordle гри
# Використання: .\update-game.ps1

Write-Host "🎯 Починаємо оновлення кримськотатарської Wordle гри..." -ForegroundColor Green

# Перевірка чи ми в правильній директорії
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Помилка: Запустіть скрипт в кореневій директорії проекту (де є package.json)" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Створюємо резервні копії..." -ForegroundColor Blue

# Створюємо backup папку
$backupDir = "backup\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Зберігаємо оригінальні файли
$filesToBackup = @(
    "src\constants\orthography.ts",
    "src\constants\config.ts", 
    "public\locales\crh\translation.json",
    "src\App.css",
    "public\index.html",
    "package.json"
)

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        Copy-Item $file $backupDir -Force
        Write-Host "✅ Збережено $file" -ForegroundColor Green
    }
}

Write-Host "✅ Резервні копії створено в $backupDir" -ForegroundColor Green

# 1. Оновлюємо orthography.ts
Write-Host "🎹 Оновлюємо клавіатуру (orthography.ts)..." -ForegroundColor Blue
$orthographyContent = @'
// src/constants/orthography.ts
// ПОКРАЩЕНА КРИМСЬКОТАТАРСЬКА КЛАВІАТУРА

export const ORTHOGRAPHY = [
  // Ряд 1 - правильний порядок QWERTY + кримськотатарські літери
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü', 'ñ',
  
  // Ряд 2 - ASDF... + кримськотатарські літери  
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i',
  
  // Ряд 3 - ZXCV... + кримськотатарські літери
  'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', 'â'
]

// Визначення рядків клавіатури для правильного відображення
export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü', 'ñ'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', 'â']
]
'@
Set-Content -Path "src\constants\orthography.ts" -Value $orthographyContent -Encoding UTF8

# 2. Оновлюємо config.ts
Write-Host "⚙️ Оновлюємо конфігурацію (config.ts)..." -ForegroundColor Blue
$configContent = @'
// src/constants/config.ts
export const CONFIG = {
  tries: 6, // Кількість спроб
  language: 'Qırımtatarca', // Назва мови
  wordLength: 5, // Довжина слова
  author: "QIRI'M Young",
  authorWebsite: 'https://ctcorpus.org',
  wordListSource: 'Qırımtatar Milliy Korpusu',
  wordListSourceLink: 'https://ctcorpus.org',
  
  // Для Google Analytics (поки залишіть пустим)
  googleAnalytics: '', 

  // --- Розширені налаштування ---
  shuffle: false, // Не перемішувати слова (слово дня)
  normalization: 'NFC', // Стандарт нормалізації Unicode
  startDate: 'January 1, 2024 00:00:00', // Дата початку гри
  defaultLang: 'crh', // Мова за замовчуванням
  availableLangs: ['crh'], // Доступні мови
  escapeSpecialCharacters: true,
  
  // --- Дизайн та кольори ---
  colors: {
    primary: '#52494B',      // Основний текст (з палітри)
    background: '#F5F5F5',   // Фон (з палітри)
    accent: '#FDE61A',       // Акцентний жовтий (з палітри)
    secondary: '#85787B',    // Вторинний текст (з палітри)
    success: '#99CEEF',      // Блакитний для правильних (з палітри)
    warning: '#FF955B',      // Помаранчевий для неправильних (з палітри)
  }
}
'@
Set-Content -Path "src\constants\config.ts" -Value $configContent -Encoding UTF8

# 3. Оновлюємо переклади
Write-Host "🇺🇦 Оновлюємо переклади (translation.json)..." -ForegroundColor Blue
New-Item -ItemType Directory -Path "public\locales\crh" -Force | Out-Null

$translationContent = @'
{
  "about": "Oyun aqqında",
  "gameName": "Söz tapuv oyunı - {{language}}",
  "enterKey": "Kirmek",
  "deleteKey": "Silmek",
  "notEnoughLetters": "Arif yeterli degil",
  "wordNotFound": "Söz tapılmadı",
  "solution": "Söz {{solution}} edi",
  "gameCopied": "Oyun kopyalandı",
  "howToPlay": "Nasıl oynamaq kerek",
  "instructions": "{{tries}} deneme içinde sözni tapıñız. Er denemeден soñ, renk qareleri sizniñ tapqan sözüñiz doğru sözge ne qadar yaqın ekenini kösterе.",
  "examples": "Misal:",
  "correctSpotInstructions": "Arif doğru yerde",
  "wrongSpotInstructions": "Arif sözde bar, amma başqa yerde", 
  "notInWordInstructions": "Arif sözde yoq",
  "pickYourLanguage": "Til saylañız",
  "statistics": "Statistika",
  "totalTries": "Umumiy denemeler",
  "successRate": "Muvafaqiyet derecesi",
  "currentStreak": "Şimdiki seriya",
  "bestStreak": "Eñ yahşı seriya",
  "newWordCountdown": "Yañı söz",
  "share": "Paylaşmaq",
  "winMessages": ["Pek güzel!", "Aferim!", "Yahşı yapıldı!", "Mükemmel!", "Fevqalade!"],
  "languages": {
    "en": "English",
    "es": "Español", 
    "sw": "Kiswahili",
    "zh": "中文",
    "crh": "Qırımtatarca"
  }
}
'@
Set-Content -Path "public\locales\crh\translation.json" -Value $translationContent -Encoding UTF8

# 4. Оновлюємо package.json
Write-Host "📦 Оновлюємо package.json..." -ForegroundColor Blue
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$packageJson.homepage = "https://qirimca.github.io/AnyLanguage-Word-Guessing-Game"
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8

# 5. Оновлюємо стилі
Write-Host "🎨 Оновлюємо стилі (App.css)..." -ForegroundColor Blue
$cssContent = @'
/* src/App.css */
/* ПОКРАЩЕНІ СТИЛІ З ПАЛІТРОЮ КОЛЬОРІВ ТА ШРИФТОМ e-Ukraine Head */

/* Імпорт шрифта e-Ukraine Head */
@import url('https://fonts.googleapis.com/css2?family=e-Ukraine+Head:wght@300;400;500;700&display=swap');

/* Кореневі змінні кольорів */
:root {
  --color-primary: #52494B;      /* Основний текст */
  --color-background: #F5F5F5;   /* Фон */
  --color-accent: #FDE61A;       /* Акцентний жовтий */
  --color-secondary: #85787B;    /* Вторинний текст */
  --color-success: #99CEEF;      /* Блакитний для правильних */
  --color-warning: #FF955B;      /* Помаранчевий для неправильних */
  --color-white: #FFFFFF;
  --color-correct: #6aaa64;      /* Зелений для правильних місць */
  --color-present: var(--color-warning); /* Помаранчевий для неправильних місць */
  --color-absent: var(--color-secondary); /* Сірий для відсутніх */
}

/* Загальні стилі */
* {
  box-sizing: border-box;
}

body {
  font-family: 'BC Sans', 'e-Ukraine Head', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: var(--color-background);
  color: var(--color-primary);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* Заголовки з шрифтом e-Ukraine Head */
h1, h2, h3, h4, h5, h6 {
  font-family: 'e-Ukraine Head', 'BC Sans', sans-serif;
  font-weight: 500;
  color: var(--color-primary);
}

/* Responsive design */
@media (max-width: 768px) {
  .game-title {
    font-size: 2rem;
  }
}
'@
Set-Content -Path "src\App.css" -Value $cssContent -Encoding UTF8

# 6. Оновлюємо index.html
Write-Host "📄 Оновлюємо index.html..." -ForegroundColor Blue
$htmlContent = @'
<!DOCTYPE html>
<html lang="crh">

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#52494B" />
    
    <!-- Мета-теги для SEO -->
    <meta name="description" content="Qırımtatar tilinde söz tapuv oyunı. Krime Tatar Word Guessing Game." />
    <meta name="keywords" content="qırımtatar, crimean tatar, wordle, söz tapuv, word game, game, oyun" />
    <meta name="author" content="QIRI'M Young" />
    
    <!-- Шрифти -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=e-Ukraine+Head:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Іконки для мобільних пристроїв -->
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    
    <!-- PWA маніфест -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    
    <title>Qırımtatar Söz Tapuv Oyunı</title>
</head>

<body>
    <noscript>
        <div style="text-align: center; padding: 2rem; font-family: 'e-Ukraine Head', sans-serif;">
            <h1>JavaScript kerek!</h1>
            <p>Bu oyun üçün JavaScript açmaq kerek.</p>
            <p>You need to enable JavaScript to run this app.</p>
        </div>
    </noscript>
    
    <div id="root"></div>
</body>

</html>
'@
Set-Content -Path "public\index.html" -Value $htmlContent -Encoding UTF8

Write-Host "✅ Всі файли оновлено!" -ForegroundColor Green

# Перевірка Git статусу
Write-Host "📋 Перевіряємо зміни..." -ForegroundColor Blue
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "Git статус:" -ForegroundColor Blue
    git status --short
    
    $response = Read-Host "🤔 Хочете закомітити зміни? (y/n)"
    if ($response -match '^[Yy]') {
        Write-Host "📝 Комітимо зміни..." -ForegroundColor Blue
        git add .
        git commit -m "feat: 🎯 Покращення кримськотатарської Wordle гри

✅ Виправлено розташування ı vs i на клавіатурі
🎨 Додана кольорова палітра ctcorpus.org  
🇺🇦 Кримськотатарські інструкції з прикладами
✒️ Шрифт e-Ukraine Head для заголовків
📱 Покращений UX та адаптивність"
        
        Write-Host "🚀 Відправляємо на GitHub..." -ForegroundColor Blue
        git push origin main
        
        Write-Host "🎉 Успішно оновлено та відправлено на GitHub!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ Зміни не закомічено. Запустіть git commands вручну коли будете готові." -ForegroundColor Blue
    }
} else {
    Write-Host "⚠️ Git не знайдено. Встановіть Git для автоматичних комітів." -ForegroundColor Red
}

Write-Host "🎯 Готово! Ваша кримськотатарська Wordle гра покращена!" -ForegroundColor Green
Write-Host "📱 Щоб запустити локально:" -ForegroundColor Blue
Write-Host "   npm install"
Write-Host "   npm start"
Write-Host "🚀 Щоб зібрати для продакшну:" -ForegroundColor Blue
Write-Host "   npm run build"
Write-Host "🌐 GitHub Pages:" -ForegroundColor Blue
Write-Host "   https://qirimca.github.io/AnyLanguage-Word-Guessing-Game/"
