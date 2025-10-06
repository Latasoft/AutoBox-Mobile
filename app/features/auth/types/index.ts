export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface User {
  _id: string;
  username: string;
  tipo_usuario: 'ADMINISTRADOR' | 'CLIENTE' | 'TRABAJADOR' | 'ASISTENTE' | 'ADMINISTRATIVO';
  email: string;
  puede_crear_nave: boolean;
  empresa_cliente?: string;
}

export interface AuthError {
  status: number;
  message: string;
}