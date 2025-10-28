# Funcionalidad "Vender Mi Auto" - Publicación Propia

## 🚀 Características Implementadas

### Backend (Node.js + TypeScript + PostgreSQL)

1. **Configuración de Base de Datos**
   - ✅ Conexión a PostgreSQL configurada
   - ✅ Tipos TypeScript para todas las entidades
   - ✅ Servicios para manejar vehículos, publicaciones, regiones y marcas

2. **API Endpoints**
   - `POST /api/listings` - Crear nueva publicación con video
   - `GET /api/listings/my-listings` - Obtener publicaciones del usuario
   - `GET /api/listings` - Obtener todas las publicaciones activas
   - `GET /api/regions` - Obtener todas las regiones
   - `GET /api/cities` - Obtener todas las ciudades
   - `GET /api/brands` - Obtener todas las marcas
   - `GET /api/brands/:brandId/models` - Obtener modelos por marca

3. **Upload de Videos**
   - ✅ Implementado con multer
   - ✅ Límite de 60MB por video
   - ✅ Formatos soportados: mp4, mov, avi, mkv
   - ✅ Videos guardados en `/backend/uploads/videos/`

### Frontend (React Native + Expo)

1. **Pantalla de Opciones de Venta** (`/vender-auto`)
   - ✅ 3 opciones de venta:
     - Publicación con Revisión Mecánica (próximamente)
     - **Publicación Propia** (implementada)
     - Subastar mi Auto (próximamente)

2. **Formulario de Publicación** (`/vender-auto-form`)
   - ✅ Campos implementados:
     - Precio de venta
     - Patente del vehículo
     - Kilometraje
     - Región/Ciudad (cargado desde BD)
     - Observaciones
     - Adjuntar video

3. **Home - Mis Autos en Venta**
   - ✅ Sección que muestra los autos publicados por el usuario
   - ✅ Carga dinámica desde la API
   - ✅ Se actualiza automáticamente al crear nueva publicación

## 📋 Cómo Usar

### 1. Iniciar el Backend

```bash
cd backend
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 2. Iniciar el Frontend

```bash
cd frontend
npx expo start
```

### 3. Flujo de Uso

1. **Desde el Home**, presiona el botón "VENDER MI AUTO"
2. Se abrirá la pantalla con las 3 opciones
3. Selecciona **"PUBLICACIÓN PROPIA"**
4. Completa el formulario:
   - Ingresa el precio de venta
   - Ingresa la patente del vehículo
   - Ingresa el kilometraje
   - Selecciona la región/ciudad
   - Agrega observaciones (opcional)
   - **Adjunta un video del vehículo** (obligatorio)
5. Presiona **"PUBLICAR"**
6. Serás redirigido al Home
7. Tu auto aparecerá en la sección **"MIS AUTOS EN VENTA"**

## 🗄️ Estructura de la Base de Datos

### Tablas Principales Utilizadas

- `vehicles` - Información del vehículo
- `vehicle_listings` - Publicaciones de venta
- `cities` - Ciudades
- `regions` - Regiones
- `vehicle_brands` - Marcas de vehículos
- `vehicle_models` - Modelos de vehículos

## 🔧 Configuración

### Variables de Entorno (Backend)

Archivo: `backend/.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=autobox_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
PORT=3000
```

### Nota Importante

Por ahora, el sistema usa `user_id = 1` por defecto. Para implementar autenticación real:
1. Agregar sistema de login/registro
2. Implementar JWT o sesiones
3. Actualizar los endpoints para usar el usuario autenticado

## 📁 Archivos Creados/Modificados

### Backend
- ✅ `backend/src/types/index.ts` - Tipos TypeScript
- ✅ `backend/src/services/vehicleService.ts` - Servicios
- ✅ `backend/src/routes/vehicles.ts` - Rutas de la API
- ✅ `backend/src/index.ts` - Servidor principal (actualizado)
- ✅ `backend/uploads/videos/` - Directorio para videos

### Frontend
- ✅ `frontend/app/vender-auto.tsx` - Pantalla de opciones
- ✅ `frontend/app/vender-auto-form.tsx` - Formulario de publicación
- ✅ `frontend/app/home.tsx` - Actualizado con integración API

## 🎨 Diseño

El diseño sigue fielmente el Figma proporcionado:
- Colores: GoodCars (verde #7CB342)
- Botones con iconos de Ionicons
- Navegación inferior con botones de retroceso y home
- Formulario limpio y organizado

## 🚧 Próximas Funcionalidades

- [ ] Publicación con Revisión Mecánica
- [ ] Subastar mi Auto
- [ ] Sistema de autenticación completo
- [ ] Upload de múltiples imágenes
- [ ] Editar/Eliminar publicaciones
- [ ] Vista detalle de publicación
- [ ] Sistema de favoritos funcional

## 📝 Notas Técnicas

1. **Validaciones**: Se implementaron validaciones básicas en frontend y backend
2. **Manejo de Errores**: Alerts informativos para el usuario
3. **Estado de Loading**: Indicadores visuales durante operaciones asíncronas
4. **Tipado Fuerte**: TypeScript en todo el proyecto para mayor seguridad

## ✅ Testing

Para probar la funcionalidad:
1. Asegúrate de que PostgreSQL esté corriendo
2. Verifica que la base de datos `autobox_db` exista y tenga las tablas
3. El script SQL ya debe estar ejecutado
4. Inicia backend y frontend
5. Sigue el flujo de uso descrito arriba

---

**Desarrollado para AutoBox Mobile** 🚗
