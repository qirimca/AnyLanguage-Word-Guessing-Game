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
            <li><code className="bg-gray-200 px-1 rounded">Alt + i</code> → <strong>ı</strong> (dotless i)</li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + g</code> → <strong>ğ</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + u</code> → <strong>ü</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + n</code> → <strong>ñ</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + s</code> → <strong>ş</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + o</code> → <strong>ö</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + c</code> → <strong>ç</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + a</code> → <strong>ä</strong></li>
            <li><code className="bg-gray-200 px-1 rounded">Alt + ^</code> → <strong>â</strong></li>
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
