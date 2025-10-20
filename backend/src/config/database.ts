import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20, // Máximo número de clientes en el pool
    idleTimeoutMillis: 30000, // Tiempo máximo que un cliente puede estar inactivo
    connectionTimeoutMillis: 2000, // Tiempo máximo para establecer una conexión
});

// Evento cuando se crea un cliente
pool.on('connect', () => {
    console.log('Base de datos conectada exitosamente');
});

// Evento cuando hay un error
pool.on('error', (err) => {
    console.error('Error en el pool de PostgreSQL:', err);
});

// Función para probar la conexión
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Conexión a PostgreSQL establecida correctamente');
        client.release();
        return true;
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error);
        return false;
    }
};

// Función para ejecutar queries
export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query ejecutado:', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('Error ejecutando query:', error);
        throw error;
    }
};

// Función para obtener un cliente del pool
export const getClient = async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // Establecer timeout de liberación automática
    const timeout = setTimeout(() => {
        console.error('Un cliente ha sido liberado automáticamente por timeout');
        release();
    }, 5000);

    // Sobreescribir función de liberación
    client.release = () => {
        clearTimeout(timeout);
        client.release = release;
        return release.apply(client);
    };

    return client;
};

export default pool;