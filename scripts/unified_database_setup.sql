-- ЕДИНЫЙ СКРИПТ ДЛЯ ПОЛНОГО СОЗДАНИЯ БАЗЫ ДАННЫХ
-- Включает все исправления, возрастные категории и тестовые данные
-- Версия: Финальная объединённая

-- Отключаем проверку внешних ключей
SET FOREIGN_KEY_CHECKS = 0;

-- Удаляем все существующие таблицы
DROP TABLE IF EXISTS costume_characteristics;
DROP TABLE IF EXISTS admin_sessions;
DROP TABLE IF EXISTS costumes;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admin_users;

-- Включаем обратно проверку внешних ключей
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- СОЗДАНИЕ ТАБЛИЦ С ПОЛНОЙ СТРУКТУРОЙ
-- ========================================

-- Создаем таблицу категорий с поддержкой возрастных групп
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url LONGTEXT, -- Увеличено для base64 изображений
    age_category VARCHAR(20) DEFAULT 'children' CHECK (age_category IN ('children', 'adults')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_active (active),
    INDEX idx_categories_age (age_category)
);

-- Создаем таблицу подкатегорий с поддержкой возрастных групп
CREATE TABLE subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    image_url LONGTEXT, -- Увеличено для base64 изображений
    age_category VARCHAR(20) DEFAULT 'children' CHECK (age_category IN ('children', 'adults')),
    count INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_subcategories_category (category_id),
    INDEX idx_subcategories_slug (slug),
    INDEX idx_subcategories_active (active),
    INDEX idx_subcategories_age (age_category)
);

-- Создаем таблицу костюмов с правильными колонками
CREATE TABLE costumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL, -- Используем title для костюмов
    description TEXT,
    category_id INT NOT NULL,
    subcategory_id INT,
    age_category VARCHAR(100) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    image_url LONGTEXT, -- Увеличено для base64 изображений
    size VARCHAR(50),
    deposit DECIMAL(10,2) DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
    INDEX idx_costumes_category (category_id),
    INDEX idx_costumes_subcategory (subcategory_id),
    INDEX idx_costumes_age (age_category),
    INDEX idx_costumes_active (active),
    INDEX idx_costumes_available (available)
);

-- Создаем таблицу характеристик костюмов
CREATE TABLE costume_characteristics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    costume_id INT NOT NULL,
    characteristic_name VARCHAR(100) NOT NULL,
    characteristic_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (costume_id) REFERENCES costumes(id) ON DELETE CASCADE,
    INDEX idx_characteristics_costume (costume_id),
    INDEX idx_characteristics_name (characteristic_name)
);

-- Создаем таблицу администраторов
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_username (username)
);

-- Создаем таблицу сессий администраторов
CREATE TABLE admin_sessions (
    id VARCHAR(255) PRIMARY KEY,
    admin_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_admin_sessions_admin (admin_id),
    INDEX idx_admin_sessions_expires (expires_at)
);

-- ========================================
-- ВСТАВКА ДАННЫХ С ВОЗРАСТНЫМИ КАТЕГОРИЯМИ
-- ========================================

-- Вставляем администратора по умолчанию
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin@arlekino.ru');

-- Вставляем детские категории
INSERT INTO categories (name, slug, description, age_category) VALUES 
('Новогодние костюмы', 'new-year-kids', 'Детские костюмы для новогодних праздников', 'children'),
('Животные', 'animals-kids', 'Детские костюмы различных животных', 'children'),
('Сказочные персонажи', 'fairy-tales-kids', 'Детские костюмы сказочных героев', 'children'),
('Профессии', 'professions-kids', 'Детские костюмы различных профессий', 'children');

-- Вставляем взрослые категории
INSERT INTO categories (name, slug, description, age_category) VALUES 
('Исторические костюмы', 'historical-adults', 'Исторические костюмы для взрослых', 'adults'),
('Карнавальные костюмы', 'carnival-adults', 'Карнавальные костюмы для взрослых', 'adults'),
('Ретро стиль', 'retro-adults', 'Костюмы в стиле разных эпох для взрослых', 'adults'),
('Фэнтези', 'fantasy-adults', 'Костюмы фантастических персонажей для взрослых', 'adults');

-- Вставляем детские подкатегории
INSERT INTO subcategories (category_id, name, slug, age_category, count) VALUES 
(1, 'Снежинки', 'snowflakes-kids', 'children', 5),
(1, 'Дед Мороз и Снегурочка', 'santa-snow-maiden-kids', 'children', 3),
(2, 'Лесные животные', 'forest-animals-kids', 'children', 8),
(2, 'Домашние животные', 'domestic-animals-kids', 'children', 6),
(3, 'Принцессы', 'princesses-kids', 'children', 4),
(3, 'Супергерои', 'superheroes-kids', 'children', 3),
(4, 'Врачи', 'doctors-kids', 'children', 2),
(4, 'Пожарные', 'firefighters-kids', 'children', 2);

-- Вставляем взрослые подкатегории
INSERT INTO subcategories (category_id, name, slug, age_category, count) VALUES 
(5, 'Средневековье', 'medieval-adults', 'adults', 4),
(5, 'Викторианская эпоха', 'victorian-adults', 'adults', 3),
(6, 'Венецианский карнавал', 'venetian-adults', 'adults', 5),
(6, 'Бразильский карнавал', 'brazilian-adults', 'adults', 4),
(7, '20-е годы', 'twenties-adults', 'adults', 3),
(7, '50-е годы', 'fifties-adults', 'adults', 3),
(8, 'Эльфы', 'elves-adults', 'adults', 2),
(8, 'Волшебники', 'wizards-adults', 'adults', 2);

-- Вставляем детские костюмы
INSERT INTO costumes (title, description, category_id, subcategory_id, age_category, price_per_day, size) VALUES 
('Снежинка голубая', 'Красивый костюм снежинки в голубых тонах', 1, 1, 'children', 900.00, '110-116'),
('Снежинка серебристая', 'Элегантный костюм снежинки с серебристыми элементами', 1, 1, 'children', 950.00, '122-128'),
('Костюм Снегурочки детский', 'Нарядный костюм Снегурочки для девочек', 1, 2, 'children', 1200.00, '116-122'),
('Лисичка рыжая', 'Яркий костюм лисички для детей', 2, 3, 'children', 1100.00, '110-116'),
('Зайчик белый', 'Милый костюм зайчика', 2, 4, 'children', 1000.00, '104-110'),
('Принцесса Эльза', 'Костюм принцессы из мультфильма', 3, 5, 'children', 1800.00, '116-122'),
('Человек-паук', 'Костюм популярного супергероя', 3, 6, 'children', 1500.00, '122-128'),
('Доктор детский', 'Костюм врача с аксессуарами', 4, 7, 'children', 800.00, '110-116');

-- Вставляем взрослые костюмы
INSERT INTO costumes (title, description, category_id, subcategory_id, age_category, price_per_day, size) VALUES 
('Рыцарь средневековый', 'Полный костюм средневекового рыцаря', 5, 9, 'adults', 2500.00, 'L'),
('Дама викторианской эпохи', 'Элегантное платье викторианской эпохи', 5, 10, 'adults', 2200.00, 'M'),
('Венецианская маска', 'Роскошный костюм для венецианского карнавала', 6, 11, 'adults', 2800.00, 'L'),
('Самба танцовщица', 'Яркий костюм для бразильского карнавала', 6, 12, 'adults', 2600.00, 'S'),
('Гангстер 20-х', 'Стильный костюм эпохи джаза', 7, 13, 'adults', 2000.00, 'XL'),
('Стиляга 50-х', 'Костюм в стиле 50-х годов', 7, 14, 'adults', 1900.00, 'M'),
('Эльф лесной', 'Мистический костюм лесного эльфа', 8, 15, 'adults', 2300.00, 'L'),
('Волшебник Мерлин', 'Костюм великого волшебника', 8, 16, 'adults', 2400.00, 'XL');

-- ========================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ========================================

-- Проверяем структуру таблиц
SELECT 'Проверка структуры таблиц:' as info;
DESCRIBE categories;
DESCRIBE subcategories;
DESCRIBE costumes;

-- Проверяем данные по возрастным категориям
SELECT 'Статистика по возрастным категориям:' as info;

SELECT 
    'Categories' as table_name,
    age_category,
    COUNT(*) as count
FROM categories 
GROUP BY age_category

UNION ALL

SELECT 
    'Subcategories' as table_name,
    age_category,
    COUNT(*) as count
FROM subcategories 
GROUP BY age_category

UNION ALL

SELECT 
    'Costumes' as table_name,
    age_category,
    COUNT(*) as count
FROM costumes 
GROUP BY age_category;

-- Общая статистика
SELECT 'Общая статистика:' as info;
SELECT 'Categories:' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Subcategories:' as table_name, COUNT(*) as count FROM subcategories
UNION ALL
SELECT 'Costumes:' as table_name, COUNT(*) as count FROM costumes
UNION ALL
SELECT 'Admin users:' as table_name, COUNT(*) as count FROM admin_users;

SELECT '✅ База данных успешно создана с полной структурой!' as status;
SELECT '✅ Добавлены возрастные категории для всех таблиц!' as status;
SELECT '✅ Загружены тестовые данные для детей и взрослых!' as status;
SELECT '✅ Система готова к работе!' as status;
