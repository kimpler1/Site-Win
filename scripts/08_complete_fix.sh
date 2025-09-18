#!/bin/bash

echo "🔧 Полное исправление проекта..."

# Остановить все процессы PM2
echo "Остановка всех процессов PM2..."
pm2 stop all
pm2 delete all

# Очистить все кеши и временные файлы
echo "Очистка кешей..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc
rm -rf dist

# Проверить и исправить права доступа
echo "Исправление прав доступа..."
chown -R root:root /var/www/arlekino
chmod -R 755 /var/www/arlekino

# Переустановить зависимости
echo "Переустановка зависимостей..."
npm ci --force

# Собрать проект
echo "Сборка проекта..."
npm run build

# Проверить успешность сборки
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
    echo "✅ Сборка успешна!"
    
    # Запустить PM2
    echo "Запуск PM2..."
    pm2 start npm --name "arlekino" -- start
    
    # Показать статус
    pm2 status
    
    echo "🎉 Проект успешно запущен!"
    echo "Проверьте сайт: http://91.92.43.69"
    echo "Админ-панель: http://91.92.43.69/admin"
else
    echo "❌ Ошибка сборки! Проверьте логи:"
    npm run build
fi
