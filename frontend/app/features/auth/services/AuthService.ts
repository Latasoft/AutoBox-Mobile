import { AuthError, LoginCredentials, LoginResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:3000/api'; // Cambia esta URL por la de tu backend

class AuthService {
  private token: string | null = null;
  private userData: User | null = null;

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Cambiar username por email para que coincida con el backend
      const loginData = {
        email: credentials.username, // El backend espera 'email'
        password: credentials.password
      };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Error al iniciar sesión',
        } as AuthError;
      }

      // Guardar datos del usuario en memoria
      if (data.success && data.data && data.data.user) {
        this.userData = data.data.user;
        // Generar un token simulado (en producción vendría del backend)
        this.token = 'auth_token_' + data.data.user.id;
      }

      return data;
    } catch (error: any) {
      // Si es un error de red
      if (error instanceof TypeError && error.message.includes('Network')) {
        throw {
          status: 0,
          message: 'Error de conexión. Verifica tu conexión a internet.',
        } as AuthError;
      }
      // Si es un error con fetch (timeout, etc)
      if (error.name === 'AbortError') {
        throw {
          status: 0,
          message: 'La solicitud ha tardado demasiado. Verifica tu conexión.',
        } as AuthError;
      }
      // Re-lanzar el error tal como viene del backend
      throw error;
    }
  }

  // Guardar token
  async setToken(token: string): Promise<void> {
    this.token = token;
  }

  // Obtener token
  async getToken(): Promise<string | null> {
    return this.token;
  }

  // Remover token (logout)
  async removeToken(): Promise<void> {
    this.token = null;
    this.userData = null;
  }

  // Verificar si está autenticado
  async isAuthenticated(): Promise<boolean> {
    // Simplemente verificar si hay token y datos de usuario
    return this.token !== null && this.userData !== null;
  }

  // Obtener datos del usuario
  async getUserData(): Promise<User | null> {
    if (!this.token) return null;

    try {
      // Si ya tenemos datos del usuario en memoria, devolverlos
      if (this.userData) {
        return this.userData;
      }

      // Obtener del servidor
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Guardar en memoria
        this.userData = userData;
        return userData;
      }

      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Logout
  async logout(): Promise<void> {
    await this.removeToken();
  }

  // Reset password
  async resetPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Error al enviar correo de recuperación',
        } as AuthError;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Network')) {
        throw {
          status: 0,
          message: 'Error de conexión. Verifica tu conexión a internet.',
        } as AuthError;
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
export default AuthService;