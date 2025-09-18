#!/bin/bash

echo "=== FINAL FIX SCRIPT ==="

# 1. Остановить и удалить PM2 процесс
echo "Stopping PM2..."
pm2 stop arlekino 2>/dev/null || true
pm2 delete arlekino 2>/dev/null || true

# 2. Очистить все кеши и сборки
echo "Cleaning caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# 3. Переустановить зависимости
echo "Reinstalling dependencies..."
npm ci

# 4. Собрать проект
echo "Building project..."
npm run build

# 5. Проверить что сборка создалась
if [ ! -d ".next" ]; then
    echo "ERROR: Build failed - .next directory not created"
    exit 1
fi

echo "Build successful!"

# 6. Запустить PM2
echo "Starting PM2..."
pm2 start npm --name "arlekino" -- start

# 7. Показать статус
echo "Checking status..."
sleep 3
pm2 status
pm2 logs arlekino --lines 10

echo "=== FIX COMPLETE ==="
echo "Site should be available at: http://91.92.43.69:3000"
echo "Admin panel: http://91.92.43.69:3000/admin"
