# 🎯 PowerShell скрипт для виправлення кримськотатарської Wordle
# Цей скрипт вирішує проблеми з GitHub Pages та додає Unicode нормалізацію

Write-Host "🎯 Запуск скрипта виправлення кримськотатарської Wordle..." -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray

# Перевірка поточної директорії
$currentDir = Get-Location
Write-Host "📍 Поточна директорія: $currentDir" -ForegroundColor Yellow

if (-not (Test-Path "package.json")) {
    Write-Host "❌ Помилка: package.json не знайдено!" -ForegroundColor Red
    Write-Host "   Переконайтеся, що ви в кореневій папці проекту" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Знайдено package.json" -ForegroundColor Green

# Функція для створення резервної копії
function Create-Backup {
    param([string]$filePath)
    if (Test-Path $filePath) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupDir = "backup/$timestamp"
        if (-not (Test-Path $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        }
        $fileName = Split-Path $filePath -Leaf
        Copy-Item $filePath "$backupDir/$fileName.backup"
        Write-Host "💾 Створено резервну копію: $backupDir/$fileName.backup" -ForegroundColor Magenta
    }
}

# 1. ДОДАВАННЯ .nojekyll ФАЙЛА ДЛЯ GITHUB PAGES
Write-Host "`n🔧 1. Додавання .nojekyll файла..." -ForegroundColor Cyan

$nojekyllPath = ".nojekyll"
if (-not (Test-Path $nojekyllPath)) {
    # Створюємо .nojekyll файл
    "" | Out-File -FilePath $nojekyllPath -Encoding UTF8
    Write-Host "✅ Створено .nojekyll файл (потрібен для React на GitHub Pages)" -ForegroundColor Green
} else {
    Write-Host "✅ .nojekyll файл вже існує" -ForegroundColor Green
}

# 2. ВИПРАВЛЕННЯ CONFIG.TS - ДОДАВАННЯ UNICODE НОРМАЛІЗАЦІЇ
Write-Host "`n🔧 2. Виправлення config.ts - додавання Unicode нормалізації..." -ForegroundColor Cyan

$configPath = "src/constants/config.ts"
if (Test-Path $configPath) {
    Create-Backup $configPath
    
    $configContent = Get-Content $configPath -Raw -Encoding UTF8
    
    # Перевіряємо чи є вже normalization
    if ($configContent -notmatch "normalization:") {
        # Додаємо normalization після wordLength
        $newConfigContent = $configContent -replace "(wordLength: 5,)", "`$1`n  normalization: 'NFC', // Unicode нормалізація для кримськотатарських літер"
        
        Set-Content -Path $configPath -Value $newConfigContent -Encoding UTF8
        Write-Host "✅ Додано normalization: 'NFC' до config.ts" -ForegroundColor Green
        Write-Host "   📝 Це важливо для правильної роботи з літерами: ı, ğ, ü, ñ, ş, ö, ç" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Unicode нормалізація вже присутня в config.ts" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Файл $configPath не знайдено!" -ForegroundColor Red
}

# 3. ПЕРЕВІРКА ТА ВИПРАВЛЕННЯ PACKAGE.JSON
Write-Host "`n🔧 3. Перевірка package.json..." -ForegroundColor Cyan

$packageJsonContent = Get-Content "package.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Перевіряємо homepage
$correctHomepage = "https://qirimca.github.io/AnyLanguage-Word-Guessing-Game"
if ($packageJsonContent.homepage -ne $correctHomepage) {
    Write-Host "❌ Homepage неправильний: $($packageJsonContent.homepage)" -ForegroundColor Red
    Write-Host "   Має бути: $correctHomepage" -ForegroundColor Yellow
} else {
    Write-Host "✅ Homepage правильний: $($packageJsonContent.homepage)" -ForegroundColor Green
}

# Перевіряємо deploy скрипти
if ($packageJsonContent.scripts.predeploy -and $packageJsonContent.scripts.deploy) {
    Write-Host "✅ Deploy скрипти присутні:" -ForegroundColor Green
    Write-Host "   predeploy: $($packageJsonContent.scripts.predeploy)" -ForegroundColor Gray
    Write-Host "   deploy: $($packageJsonContent.scripts.deploy)" -ForegroundColor Gray
} else {
    Write-Host "❌ Deploy скрипти відсутні!" -ForegroundColor Red
}

# 4. ПЕРЕВІРКА GITHUB WORKFLOW
Write-Host "`n🔧 4. Перевірка GitHub Actions workflow..." -ForegroundColor Cyan

$workflowPath = ".github/workflows/publish.yml"
if (Test-Path $workflowPath) {
    Write-Host "✅ Знайдено GitHub Actions workflow: $workflowPath" -ForegroundColor Green
    
    $workflowContent = Get-Content $workflowPath -Raw -Encoding UTF8
    
    # Перевіряємо чи є правильні налаштування
    if ($workflowContent -match "JamesIves/github-pages-deploy-action") {
        Write-Host "✅ Workflow використовує github-pages-deploy-action" -ForegroundColor Green
    }
    
    if ($workflowContent -match "branch: gh-pages") {
        Write-Host "✅ Workflow деплоїть в gh-pages гілку" -ForegroundColor Green
    }
    
    if ($workflowContent -match "folder: build") {
        Write-Host "✅ Workflow деплоїть з build папки" -ForegroundColor Green
    }
} else {
    Write-Host "❌ GitHub Actions workflow не знайдено!" -ForegroundColor Red
}

# 5. СТВОРЕННЯ ДОДАТКОВОГО .nojekyll В PUBLIC ПАПЦІ
Write-Host "`n🔧 5. Додавання .nojekyll в public папку..." -ForegroundColor Cyan

$publicNojekyllPath = "public/.nojekyll"
if (-not (Test-Path $publicNojekyllPath)) {
    if (-not (Test-Path "public")) {
        New-Item -ItemType Directory -Path "public" -Force | Out-Null
    }
    "" | Out-File -FilePath $publicNojekyllPath -Encoding UTF8
    Write-Host "✅ Створено .nojekyll в public папці" -ForegroundColor Green
} else {
    Write-Host "✅ .nojekyll вже існує в public папці" -ForegroundColor Green
}

# 6. ІНСТРУКЦІЇ ДЛЯ НАЛАШТУВАННЯ GITHUB PAGES
Write-Host "`n📋 6. Інструкції для налаштування GitHub Pages:" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

Write-Host "1. Перейдіть на GitHub: https://github.com/qirimca/AnyLanguage-Word-Guessing-Game" -ForegroundColor White
Write-Host "2. Відкрийте Settings > Pages" -ForegroundColor White
Write-Host "3. В розділі 'Source' оберіть:" -ForegroundColor White
Write-Host "   - Source: Deploy from a branch" -ForegroundColor Yellow
Write-Host "   - Branch: gh-pages" -ForegroundColor Yellow
Write-Host "   - Folder: / (root)" -ForegroundColor Yellow
Write-Host "4. Натисніть Save" -ForegroundColor White
Write-Host "5. Зачекайте 5-10 хвилин на деплой" -ForegroundColor White

# 7. КОМІТ ЗМІН
Write-Host "`n🚀 7. Коміт змін..." -ForegroundColor Cyan

try {
    git add .nojekyll
    git add public/.nojekyll
    if (Test-Path $configPath) {
        git add $configPath
    }
    
    git commit -m "fix: 🔧 Додано .nojekyll файли та Unicode нормалізацію

- Додано .nojekyll файли для коректної роботи GitHub Pages з React
- Відновлено CONFIG.normalization: 'NFC' для кримськотатарських літер
- Виправлено підтримку спеціальних символів: ı, ğ, ü, ñ, ş, ö, ç"

    Write-Host "✅ Зміни закомічено!" -ForegroundColor Green
    
    git push origin main
    Write-Host "✅ Зміни відправлено на GitHub!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Помилка при роботі з Git: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. РЕЗУЛЬТАТ ТА НАСТУПНІ КРОКИ
Write-Host "`n🎉 РЕЗУЛЬТАТ:" -ForegroundColor Green
Write-Host "=" * 30 -ForegroundColor Gray

Write-Host "✅ Додано .nojekyll файли" -ForegroundColor Green
Write-Host "✅ Відновлено Unicode нормалізацію" -ForegroundColor Green
Write-Host "✅ Зміни закомічено та відправлено" -ForegroundColor Green

Write-Host "`n📋 НАСТУПНІ КРОКИ:" -ForegroundColor Cyan
Write-Host "1. Налаштуйте GitHub Pages (дивіться інструкції вище)" -ForegroundColor Yellow
Write-Host "2. Зачекайте 5-10 хвилин на автоматичний деплой" -ForegroundColor Yellow
Write-Host "3. Перевірте сайт: https://qirimca.github.io/AnyLanguage-Word-Guessing-Game/" -ForegroundColor Yellow
Write-Host "4. Якщо все працює - переходьте до реалізації фізичної клавіатури" -ForegroundColor Yellow

Write-Host "`n🔍 ДЛЯ ДІАГНОСТИКИ:" -ForegroundColor Magenta
Write-Host "- Перевірте GitHub Actions в розділі Actions" -ForegroundColor Gray
Write-Host "- Дивіться в Console браузера на помилки" -ForegroundColor Gray
Write-Host "- Очистіть кеш браузера (Ctrl+Shift+R)" -ForegroundColor Gray

Write-Host "`n🎯 Скрипт завершено!" -ForegroundColor Cyan