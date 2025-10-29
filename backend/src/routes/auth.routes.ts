import { Request, Response, Router } from 'express';
import pool from '../config/database';

const router = Router();

// Interfaz para el body del login
interface LoginRequest {
    email: string;
    password: string;
}

/**
 * POST /api/auth/login
 * Endpoint para iniciar sesión
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginRequest;

        // Validar que se envíen email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del correo electrónico es inválido'
            });
        }

        // Consultar usuario por email
        const userQuery = `
            SELECT 
                u.id,
                u.email,
                u.password_hash,
                u.is_active,
                u.email_verified,
                ur.name as role_name,
                ur.permissions
            FROM users u
            JOIN user_roles ur ON u.role_id = ur.id
            WHERE u.email = $1
        `;

        const userResult = await pool.query(userQuery, [email]);

        // Si no se encuentra el usuario
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'El correo electrónico es incorrecto'
            });
        }

        const user = userResult.rows[0];

        // Verificar que el usuario esté activo
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Usuario inactivo. Contacta al administrador.'
            });
        }

        // Verificar contraseña usando pgcrypto
        const passwordQuery = `
            SELECT (password_hash = crypt($1, password_hash)) as password_valid
            FROM users
            WHERE id = $2
        `;

        const passwordResult = await pool.query(passwordQuery, [password, user.id]);
        const isPasswordValid = passwordResult.rows[0].password_valid;

        // Si la contraseña es incorrecta
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña es incorrecta'
            });
        }

        // Obtener información del perfil del usuario
        let profileQuery = '';
        let profileName = '';
        let profileBalance = 0;

        if (user.role_name === 'particular' || user.role_name === 'administrador') {
            profileQuery = `
                SELECT 
                    first_name,
                    last_name,
                    balance,
                    profile_picture_url
                FROM user_profiles
                WHERE user_id = $1
            `;
            const profileResult = await pool.query(profileQuery, [user.id]);
            if (profileResult.rows.length > 0) {
                const profile = profileResult.rows[0];
                profileName = `${profile.first_name} ${profile.last_name}`;
                profileBalance = parseFloat(profile.balance) || 0;
            }
        } else if (user.role_name === 'empresa') {
            profileQuery = `
                SELECT 
                    company_name,
                    balance,
                    logo_url
                FROM company_profiles
                WHERE user_id = $1
            `;
            const profileResult = await pool.query(profileQuery, [user.id]);
            if (profileResult.rows.length > 0) {
                const profile = profileResult.rows[0];
                profileName = profile.company_name;
                profileBalance = parseFloat(profile.balance) || 0;
            }
        } else if (user.role_name === 'mecanico') {
            profileQuery = `
                SELECT 
                    first_name,
                    last_name,
                    balance,
                    rating,
                    total_inspections
                FROM mechanics
                WHERE user_id = $1
            `;
            const profileResult = await pool.query(profileQuery, [user.id]);
            if (profileResult.rows.length > 0) {
                const profile = profileResult.rows[0];
                profileName = `${profile.first_name} ${profile.last_name}`;
                profileBalance = parseFloat(profile.balance) || 0;
            }
        }

        // Actualizar last_login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Devolver información del usuario (sin el password_hash)
        return res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role_name,
                    permissions: user.permissions,
                    name: profileName,
                    balance: profileBalance,
                    isActive: user.is_active,
                    emailVerified: user.email_verified
                }
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

/**
 * POST /api/auth/logout
 * Endpoint para cerrar sesión
 */
router.post('/logout', async (req: Request, res: Response) => {
    // En un sistema con JWT, el logout se maneja en el cliente
    // eliminando el token almacenado
    return res.json({
        success: true,
        message: 'Logout exitoso'
    });
});

/**
 * GET /api/auth/verify
 * Endpoint para verificar si el usuario está autenticado
 */
router.get('/verify', async (req: Request, res: Response) => {
    // Este endpoint se usaría con middleware de autenticación JWT
    // Por ahora solo devuelve que no está implementado
    return res.json({
        success: false,
        message: 'Verificación JWT no implementada aún'
    });
});

/**
 * POST /api/auth/register
 * Endpoint para registrar un nuevo usuario
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            first_name,
            last_name,
            second_last_name,
            rut,
            phone,
            address
        } = req.body;

        // Validaciones
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: 'Email, contraseña, nombre y apellido son obligatorios'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del correo electrónico es inválido'
            });
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el email ya existe
        const emailCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Obtener rol 'particular' (ID = 1)
        const roleQuery = await pool.query(
            "SELECT id FROM user_roles WHERE name = 'particular' LIMIT 1"
        );

        if (roleQuery.rows.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error: No se encontró el rol de usuario'
            });
        }

        const roleId = roleQuery.rows[0].id;

        // Crear usuario con contraseña encriptada usando pgcrypto
        const userQuery = `
            INSERT INTO users (email, password_hash, role_id, is_active, email_verified)
            VALUES ($1, crypt($2, gen_salt('bf')), $3, true, false)
            RETURNING id, email, created_at
        `;

        const userResult = await pool.query(userQuery, [email, password, roleId]);
        const newUser = userResult.rows[0];

        // Crear perfil de usuario
        const profileQuery = `
            INSERT INTO user_profiles (
                user_id, first_name, last_name, second_last_name, 
                rut, phone, address, balance
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, 0)
            RETURNING *
        `;

        await pool.query(profileQuery, [
            newUser.id,
            first_name,
            last_name,
            second_last_name || null,
            rut || null,
            phone || null,
            address || null
        ]);

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: `${first_name} ${last_name}`
                }
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

/**
 * POST /api/auth/reset-password-request
 * Endpoint para solicitar restablecimiento de contraseña
 */
router.post('/reset-password-request', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'El email es requerido'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del correo electrónico es inválido'
            });
        }

        // Verificar si el usuario existe
        const userCheck = await pool.query(
            'SELECT id, email, is_active FROM users WHERE email = $1',
            [email]
        );

        // Por seguridad, siempre devolver success true incluso si el email no existe
        // para no revelar qué emails están registrados
        if (userCheck.rows.length === 0) {
            return res.json({
                success: true,
                message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
            });
        }

        const user = userCheck.rows[0];

        if (!user.is_active) {
            return res.json({
                success: true,
                message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
            });
        }

        // TODO: Aquí deberías:
        // 1. Generar un token único de recuperación
        // 2. Guardar el token en la base de datos con fecha de expiración
        // 3. Enviar email con link de recuperación
        // Por ahora solo simulamos el éxito

        console.log(`📧 Solicitud de reset password para: ${email}`);

        return res.json({
            success: true,
            message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
        });

    } catch (error) {
        console.error('Error en reset-password-request:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

export default router;
