#!/bin/bash

# Скрипт для очистки кеша Next.js и перезапуска приложения

echo "Очистка кеша Next.js..."
rm -rf .next

echo "Очистка node_modules кеша..."
npm cache clean --force

echo "Перезапуск приложения..."
pm2 restart arlekino

echo "Проверка статуса..."
pm2 status arlekino

echo "Готово! Приложение перезапущено с очищенным кешем."
