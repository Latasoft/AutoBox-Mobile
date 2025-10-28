// Tipos de enums de la base de datos
export type UserRoleType = 'particular' | 'empresa' | 'mecanico' | 'administrador';
export type VehicleBodyType = 'sedan' | 'hatchback' | 'suv' | 'pickup' | 'coupe' | 'convertible' | 'wagon';
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'gas';
export type TransmissionType = 'manual' | 'automatic' | 'cvt';
export type ListingType = 'sale' | 'auction' | 'inspection_sale';
export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired' | 'cancelled';

// Interfaces principales
export interface User {
  id: number;
  role_id: number;
  email: string;
  rut?: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleBrand {
  id: number;
  name: string;
  logo_url?: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface VehicleModel {
  id: number;
  brand_id: number;
  name: string;
  year_from?: number;
  year_to?: number;
  body_type: VehicleBodyType;
  fuel_type: FuelType;
  transmission: TransmissionType;
  engine_size?: number;
  fuel_efficiency?: number;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface Vehicle {
  id: number;
  owner_id: number;
  brand_id: number;
  model_id: number;
  license_plate: string;
  year: number;
  color?: string;
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  engine_size?: number;
  vin?: string;
  registration_date?: Date;
  last_inspection_date?: Date;
  next_inspection_date?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleListing {
  id: number;
  vehicle_id: number;
  seller_id: number;
  title: string;
  description?: string;
  price: number;
  listing_type: ListingType;
  status: ListingStatus;
  is_featured: boolean;
  views_count: number;
  favorites_count: number;
  city_id?: number;
  video_url?: string;
  images?: string[];
  has_mechanical_inspection: boolean;
  inspection_report_id?: number;
  expires_at?: Date;
  published_at?: Date;
  sold_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Region {
  id: number;
  name: string;
  code?: string;
  created_at: Date;
}

export interface City {
  id: number;
  region_id: number;
  name: string;
  code?: string;
  created_at: Date;
}

// DTOs para requests
export interface CreateVehicleListingDTO {
  price: number;
  license_plate: string;
  mileage: number;
  city_id: number;
  observations?: string;
  video_url?: string;
  listing_type?: ListingType;
}

export interface CreateVehicleDTO {
  brand_id: number;
  model_id: number;
  license_plate: string;
  year: number;
  color?: string;
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  engine_size?: number;
}
