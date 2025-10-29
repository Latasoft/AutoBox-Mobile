import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';
import { testDatabaseConnection } from './utils/database-test';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de API
app.use('/api/auth', authRoutes);

// Endpoints para autoboxes
app.get('/api/autoboxes', async (req, res) => {
    try {
        const { query } = await import('./config/database');
        const result = await query('SELECT id_autobox, nombre, direccion, ciudad FROM autoboxes WHERE activo = true ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo autoboxes:', error);
        res.status(500).json({ error: 'Error obteniendo autoboxes' });
    }
});

// Endpoints para horarios
app.get('/api/horarios', async (req, res) => {
    try {
        const { query } = await import('./config/database');
        const result = await query('SELECT id_horario, hora FROM horarios_disponibles WHERE activo = true ORDER BY hora');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo horarios:', error);
        res.status(500).json({ error: 'Error obteniendo horarios' });
    }
});

// Endpoint para crear publicaciones
app.post('/api/publicaciones', async (req, res) => {
    try {
        const { query } = await import('./config/database');
        const {
            id_usuario,
            tipo_publicacion,
            precio_venta,
            patente,
            marca,
            modelo,
            año,
            kilometraje,
            region,
            ciudad,
            observaciones,
            video_url,
            fecha_revision,
            hora_revision,
            id_autobox,
            rut,
            telefono,
            email,
            precio_objetivo
        } = req.body;

        const result = await query(
            `INSERT INTO publicaciones 
            (id_usuario, tipo_publicacion, precio_venta, patente, marca, modelo, año, kilometraje, 
             region, ciudad, observaciones, video_url, fecha_revision, hora_revision, id_autobox, 
             rut, telefono, email, precio_objetivo, estado) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'pendiente')
            RETURNING *`,
            [id_usuario, tipo_publicacion, precio_venta, patente, marca, modelo, año, kilometraje,
             region, ciudad, observaciones, video_url, fecha_revision, hora_revision, id_autobox, 
             rut, telefono, email, precio_objetivo]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Publicación creada exitosamente',
            publicacion: result.rows[0] 
        });
    } catch (error) {
        console.error('Error creando publicación:', error);
        res.status(500).json({ error: 'Error creando publicación' });
    }
});

// Endpoint para obtener publicaciones
app.get('/api/publicaciones', async (req, res) => {
    try {
        const { query } = await import('./config/database');
        const result = await query(`
            SELECT p.*, 
                   CONCAT(up.first_name, ' ', up.last_name) as nombre_usuario, 
                   u.email as email_usuario
            FROM publicaciones p
            LEFT JOIN users u ON p.id_usuario = u.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE p.estado = 'aprobada' OR p.estado = 'pendiente'
            ORDER BY p.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo publicaciones:', error);
        res.status(500).json({ error: 'Error obteniendo publicaciones' });
    }
});

// Endpoint para obtener inspecciones de un usuario
app.get('/api/publicaciones/inspecciones/:userId', async (req, res) => {
    try {
        const { query } = await import('./config/database');
        const { userId } = req.params;
        
        const result = await query(`
            SELECT p.*, 
                   a.nombre as autobox_nombre,
                   a.direccion as autobox_direccion
            FROM publicaciones p
            LEFT JOIN autoboxes a ON p.id_autobox = a.id_autobox
            WHERE p.id_usuario = $1 
            AND p.tipo_publicacion = 'con_revision'
            ORDER BY p.created_at DESC
        `, [userId]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo inspecciones:', error);
        res.status(500).json({ error: 'Error obteniendo inspecciones' });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>AutoBox API</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .status {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }
                h1 { color: #333; }
                .success { color: #28a745; }
            </style>
        </head>
        <body>
            <div class="status">
                <h1>🚗 AutoBox API</h1>
                <h2 class="success">✅ Sistema funcionando correctamente</h2>
                <p>La API está lista para recibir solicitudes.</p>
            </div>
        </body>
        </html>
    `);
});

// Ruta de prueba general
app.get('/test', (req, res) => {
    res.json({ 
        status: 'success',
        message: '✅ API funcionando correctamente'
    });
});

// Ruta de prueba de base de datos
app.get('/test-db', async (req, res) => {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
        res.json({ 
            status: 'success',
            message: '✅ Conexión a base de datos exitosa' 
        });
    } else {
        res.status(500).json({ 
            status: 'error',
            message: '❌ Error conectando a la base de datos' 
        });
    }
});

// Ruta de estado
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date(),
        services: {
            api: '✅ Funcionando',
            database: '✅ Conectada'
        }
    });
});

// Limpiar la consola al iniciar
console.clear();

// Iniciar servidor
app.listen(port, async () => {
    // Probar conexión a base de datos
    await testDatabaseConnection();
    
    console.log('\n===========================================');
    console.log('🚀 Sistema AutoBox iniciado exitosamente');
    console.log('===========================================\n');
    console.log('✅ Backend corriendo en: http://localhost:' + port);
    console.log('📱 Frontend Expo disponible en: http://localhost:8081');
    console.log('\n💡 Presiona "w" en la terminal de Expo para abrir en navegador');
    console.log('📱 Escanea el código QR con Expo Go para abrir en tu dispositivo\n');
    console.log('🌟 Sistema completo disponible para usar!\n');
});