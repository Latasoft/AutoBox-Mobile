-- ============================================================================
-- SCRIPT DE DATOS INICIALES PARA AUTOBOX
-- Ejecutar este script después del script principal para tener datos de prueba
-- ============================================================================

-- Insertar más regiones de Chile
INSERT INTO regions (name, code) VALUES 
('Región de Arica y Parinacota', 'AP'),
('Región de Tarapacá', 'TA'),
('Región de Antofagasta', 'AN'),
('Región de Atacama', 'AT'),
('Región de Coquimbo', 'CO'),
('Región de Valparaíso', 'VA'),
('Región del Libertador General Bernardo O''Higgins', 'LI'),
('Región del Maule', 'ML'),
('Región de Ñuble', 'NB'),
('Región del Biobío', 'BI'),
('Región de La Araucanía', 'AR'),
('Región de Los Ríos', 'LR'),
('Región de Los Lagos', 'LL'),
('Región de Aysén del General Carlos Ibáñez del Campo', 'AI'),
('Región de Magallanes y de la Antártica Chilena', 'MA')
ON CONFLICT (code) DO NOTHING;

-- Insertar ciudades principales
INSERT INTO cities (region_id, name, code) VALUES 
-- Región Metropolitana (id: 1)
(1, 'Santiago', 'STG'),
(1, 'Maipú', 'MAI'),
(1, 'La Florida', 'LFL'),
(1, 'Puente Alto', 'PUA'),
(1, 'Las Condes', 'LCO'),
(1, 'Providencia', 'PRO'),
(1, 'Ñuñoa', 'ÑUN'),

-- Región de Valparaíso (asumiendo id: 7)
(7, 'Valparaíso', 'VAL'),
(7, 'Viña del Mar', 'VDM'),
(7, 'Quilpué', 'QUI'),
(7, 'Villa Alemana', 'VAL'),

-- Región del Biobío (asumiendo id: 11)
(11, 'Concepción', 'CON'),
(11, 'Talcahuano', 'TAL'),
(11, 'Los Ángeles', 'LAN'),
(11, 'Chillán', 'CHI')
ON CONFLICT (region_id, name) DO NOTHING;

-- Insertar más marcas de vehículos
INSERT INTO vehicle_brands (name, logo_url, description, is_active) VALUES 
('Toyota', '/assets/brands/toyota.png', 'Marca japonesa líder mundial', true),
('Honda', '/assets/brands/honda.png', 'Confiabilidad japonesa', true),
('Ford', '/assets/brands/ford.png', 'Marca americana clásica', true),
('Chevrolet', '/assets/brands/chevrolet.png', 'General Motors', true),
('Nissan', '/assets/brands/nissan.png', 'Innovación japonesa', true),
('Hyundai', '/assets/brands/hyundai.png', 'Calidad coreana', true),
('Kia', '/assets/brands/kia.png', 'Diseño y tecnología', true),
('Volkswagen', '/assets/brands/volkswagen.png', 'Ingeniería alemana', true),
('BMW', '/assets/brands/bmw.png', 'Lujo y deportividad', true),
('Mercedes-Benz', '/assets/brands/mercedes.png', 'Lujo alemán', true),
('Audi', '/assets/brands/audi.png', 'Tecnología premium', true),
('Peugeot', '/assets/brands/peugeot.png', 'Estilo francés', true),
('Suzuki', '/assets/brands/suzuki.png', 'Compactos eficientes', true),
('Mitsubishi', '/assets/brands/mitsubishi.png', 'Resistencia japonesa', true),
('Subaru', '/assets/brands/subaru.png', 'Tracción integral', true)
ON CONFLICT (name) DO NOTHING;

-- Obtener IDs de las marcas (ajusta según tu base de datos)
-- Insertar modelos populares para Mazda
INSERT INTO vehicle_models (brand_id, name, year_from, year_to, body_type, fuel_type, transmission, engine_size, fuel_efficiency, is_active) VALUES 
((SELECT id FROM vehicle_brands WHERE name = 'Mazda'), 'Mazda 3', 2010, 2024, 'sedan', 'gasoline', 'automatic', 2.0, 16.5, true),
((SELECT id FROM vehicle_brands WHERE name = 'Mazda'), 'Mazda CX-5', 2012, 2024, 'suv', 'gasoline', 'automatic', 2.5, 14.0, true),
((SELECT id FROM vehicle_brands WHERE name = 'Mazda'), 'Mazda CX-3', 2015, 2023, 'suv', 'gasoline', 'automatic', 2.0, 16.0, true),

-- Toyota
((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'Corolla', 2008, 2024, 'sedan', 'gasoline', 'automatic', 1.8, 17.0, true),
((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'Yaris', 2008, 2024, 'hatchback', 'gasoline', 'manual', 1.5, 18.0, true),
((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'RAV4', 2010, 2024, 'suv', 'hybrid', 'automatic', 2.5, 17.5, true),
((SELECT id FROM vehicle_brands WHERE name = 'Toyota'), 'Hilux', 2010, 2024, 'pickup', 'diesel', 'manual', 2.8, 12.0, true),

-- Chevrolet
((SELECT id FROM vehicle_brands WHERE name = 'Chevrolet'), 'Spark', 2010, 2024, 'hatchback', 'gasoline', 'manual', 1.2, 19.0, true),
((SELECT id FROM vehicle_brands WHERE name = 'Chevrolet'), 'Sail', 2010, 2022, 'sedan', 'gasoline', 'manual', 1.5, 16.0, true),
((SELECT id FROM vehicle_brands WHERE name = 'Chevrolet'), 'Cruze', 2010, 2019, 'sedan', 'gasoline', 'automatic', 1.8, 14.5, true),

-- Hyundai
((SELECT id FROM vehicle_brands WHERE name = 'Hyundai'), 'Accent', 2010, 2024, 'sedan', 'gasoline', 'automatic', 1.6, 16.5, true),
((SELECT id FROM vehicle_brands WHERE name = 'Hyundai'), 'Tucson', 2010, 2024, 'suv', 'gasoline', 'automatic', 2.0, 13.5, true),
((SELECT id FROM vehicle_brands WHERE name = 'Hyundai'), 'Elantra', 2010, 2024, 'sedan', 'gasoline', 'automatic', 1.6, 16.0, true),

-- Nissan
((SELECT id FROM vehicle_brands WHERE name = 'Nissan'), 'Versa', 2010, 2024, 'sedan', 'gasoline', 'manual', 1.6, 17.0, true),
((SELECT id FROM vehicle_brands WHERE name = 'Nissan'), 'March', 2010, 2020, 'hatchback', 'gasoline', 'manual', 1.6, 18.5, true),
((SELECT id FROM vehicle_brands WHERE name = 'Nissan'), 'Qashqai', 2014, 2024, 'suv', 'gasoline', 'automatic', 2.0, 14.0, true),

-- Suzuki
((SELECT id FROM vehicle_brands WHERE name = 'Suzuki'), 'Swift', 2010, 2024, 'hatchback', 'gasoline', 'manual', 1.4, 18.0, true),
((SELECT id FROM vehicle_brands WHERE name = 'Suzuki'), 'Baleno', 2016, 2024, 'sedan', 'gasoline', 'manual', 1.4, 18.5, true),
((SELECT id FROM vehicle_brands WHERE name = 'Suzuki'), 'Vitara', 2015, 2024, 'suv', 'gasoline', 'automatic', 1.6, 15.0, true)
ON CONFLICT DO NOTHING;

-- Insertar categoría adicional
INSERT INTO vehicle_categories (name, description, criteria, is_visible) VALUES 
('SUVs Familiares', 'Vehículos SUV ideales para familias', '{"body_type": "suv"}', true),
('Sedanes Ejecutivos', 'Sedanes de lujo y confort', '{"body_type": "sedan", "price_min": 10000000}', true),
('Pickups de Trabajo', 'Camionetas para trabajo pesado', '{"body_type": "pickup"}', true),
('Compactos Urbanos', 'Perfectos para la ciudad', '{"body_type": "hatchback"}', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar usuario de prueba adicional
INSERT INTO users (role_id, email, password_hash, rut, phone, is_active, email_verified) VALUES 
(1, 'test@autobox.cl', crypt('test123', gen_salt('bf')), '11111111-1', '+56911111111', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insertar perfil para el usuario de prueba
INSERT INTO user_profiles (user_id, first_name, last_name, birth_date, city_id, balance) 
SELECT 
    u.id,
    'Usuario',
    'Prueba',
    '1990-01-01',
    (SELECT id FROM cities WHERE name = 'Santiago' LIMIT 1),
    500000.00
FROM users u
WHERE u.email = 'test@autobox.cl'
ON CONFLICT (user_id) DO NOTHING;

-- Verificar datos insertados
SELECT 'Regiones insertadas:' as info, COUNT(*) as total FROM regions;
SELECT 'Ciudades insertadas:' as info, COUNT(*) as total FROM cities;
SELECT 'Marcas insertadas:' as info, COUNT(*) as total FROM vehicle_brands;
SELECT 'Modelos insertados:' as info, COUNT(*) as total FROM vehicle_models;
SELECT 'Usuarios creados:' as info, COUNT(*) as total FROM users;

-- ============================================================================
-- FIN DEL SCRIPT DE DATOS INICIALES
-- ============================================================================
