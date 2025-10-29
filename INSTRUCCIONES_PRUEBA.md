# 🚀 GUÍA RÁPIDA - PROBAR "VENDER MI AUTO"

## ✅ Pre-requisitos Completados

- ✅ Backend configurado con PostgreSQL
- ✅ Tipos TypeScript implementados
- ✅ API endpoints creados
- ✅ Frontend con formulario completo
- ✅ Integración con la base de datos
- ✅ Upload de videos implementado

## 📝 PASOS PARA PROBAR

### 1. Poblar la Base de Datos (IMPORTANTE)

Ejecuta el script de datos iniciales en pgAdmin:

```sql
-- Abre el archivo: backend/datos_iniciales.sql
-- Ejecuta el script completo en pgAdmin
```

Esto creará:
- Más regiones y ciudades de Chile
- Marcas y modelos de vehículos populares
- Usuario de prueba (email: test@autobox.cl, password: test123)
- Categorías de vehículos

### 2. Iniciar el Backend

Abre una terminal en la carpeta del proyecto:

```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Backend corriendo en: http://localhost:3000
🗄️ Conexión a PostgreSQL establecida correctamente
```

### 3. Iniciar el Frontend

Abre OTRA terminal:

```bash
cd frontend
npx expo start
```

Opciones:
- Presiona `w` para abrir en el navegador
- Escanea el QR con Expo Go en tu teléfono
- Presiona `a` para Android emulator
- Presiona `i` para iOS simulator

### 4. Probar el Flujo Completo

1. **En el Home:**
   - Verás el botón "VENDER MI AUTO" (verde con ícono de auto)
   - Click en ese botón

2. **Pantalla de Opciones:**
   - Verás 3 tarjetas azules:
     - Publicación con Revisión Mecánica
     - **PUBLICACIÓN PROPIA** ← Click aquí
     - Subastar mi Auto

3. **Formulario de Publicación:**
   - Completa los campos:
     - **Precio Venta:** 5500000
     - **Patente:** TESTXX (6 caracteres)
     - **Kilometraje:** 85000
     - **Región/Ciudad:** Selecciona Santiago, Región Metropolitana
     - **Observaciones:** "Vehículo en excelente estado"
   
4. **Adjuntar Video:**
   - Click en "ADJUNTAR VIDEO"
   - Selecciona un video de tu dispositivo/computadora
   - Máximo 60MB
   - Deberías ver "✓ Video seleccionado"

5. **Publicar:**
   - Click en "PUBLICAR"
   - Espera unos segundos (verás un indicador de carga)
   - Recibirás un mensaje de éxito
   - Serás redirigido al Home

6. **Verificar en Home:**
   - En la sección "MIS AUTOS EN VENTA"
   - Deberías ver tu auto recién publicado
   - Con toda la información que ingresaste

## 🧪 Pruebas Adicionales

### Verificar en la Base de Datos

En pgAdmin, ejecuta:

```sql
-- Ver todos los vehículos
SELECT * FROM vehicles ORDER BY created_at DESC;

-- Ver todas las publicaciones
SELECT * FROM vehicle_listings ORDER BY created_at DESC;

-- Ver publicaciones con detalles
SELECT 
    vl.id,
    vl.title,
    vl.price,
    v.license_plate,
    v.mileage,
    vl.video_url,
    vl.status
FROM vehicle_listings vl
JOIN vehicles v ON vl.vehicle_id = v.id
ORDER BY vl.created_at DESC;
```

### Verificar Videos Subidos

Los videos se guardan en:
```
backend/uploads/videos/
```

Puedes acceder a ellos desde:
```
http://localhost:3000/uploads/videos/nombre-del-video.mp4
```

### Probar la API Directamente

Con Postman o desde el navegador:

```
GET http://localhost:3000/api/cities
GET http://localhost:3000/api/listings
GET http://localhost:3000/api/listings/my-listings?user_id=1
GET http://localhost:3000/api/brands
```

## 🐛 Solución de Problemas

### "No se pudieron cargar las ciudades"
- Verifica que el backend esté corriendo
- Ejecuta el script `datos_iniciales.sql`
- Verifica en pgAdmin que existan registros en la tabla `cities`

### "Error al publicar"
- Revisa la consola del backend para ver el error específico
- Verifica que el video no supere 60MB
- Asegúrate de que todos los campos obligatorios estén llenos

### "No se muestra mi auto en el Home"
- Refresca la app (pull down en el Home)
- Verifica en la base de datos que la publicación se haya creado
- Revisa que el `status` sea 'active'

### Backend no se conecta a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `backend/.env`
- Asegúrate de que la base de datos `autobox_db` exista

## 📊 Datos de Prueba

Si necesitas más datos de prueba, puedes crear publicaciones con estas patentes:

- TEST01 - Mazda 2 2011
- TEST02 - Toyota Yaris 2015
- TEST03 - Chevrolet Spark 2018
- TEST04 - Hyundai Accent 2016

## 🎉 ¡Listo!

La funcionalidad de "Vender Mi Auto - Publicación Propia" está completamente implementada y funcional.

### Características implementadas:
✅ Formulario completo con validaciones
✅ Upload de video con límite de 60MB
✅ Integración con PostgreSQL
✅ API RESTful
✅ Diseño fiel al Figma
✅ Navegación entre pantallas
✅ Actualización dinámica del Home

### Próximos pasos sugeridos:
- [ ] Implementar autenticación de usuarios
- [ ] Agregar upload de múltiples imágenes
- [ ] Implementar las otras opciones (Con Revisión, Subastar)
- [ ] Agregar edición y eliminación de publicaciones
- [ ] Implementar vista de detalle de publicación

---

**¿Necesitas ayuda?** Revisa el archivo `VENDER_AUTO_README.md` para más detalles técnicos.
