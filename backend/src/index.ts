import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { testDatabaseConnection } from './utils/database-test';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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