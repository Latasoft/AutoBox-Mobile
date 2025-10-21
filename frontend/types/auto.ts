export interface Auto {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  imagen: string;
  kilometraje: number;
  esFavorito: boolean;
  tieneInspeccion: boolean;
  esEconomico: boolean;
  patente: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  saldo: number;
  avatar?: string;
}

export interface MarcaAuto {
  id: string;
  nombre: string;
  logo: string;
}