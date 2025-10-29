import { query } from '../config/database';
import { CreateVehicleDTO, CreateVehicleListingDTO, Vehicle, VehicleListing } from '../types';

export class VehicleService {
  // Crear o actualizar un vehículo
  static async createOrUpdateVehicle(ownerId: number, vehicleData: CreateVehicleDTO): Promise<Vehicle> {
    try {
      // Primero verificar si ya existe un vehículo con esa patente
      const existingVehicle = await query(
        'SELECT * FROM vehicles WHERE license_plate = $1',
        [vehicleData.license_plate]
      );

      if (existingVehicle.rows.length > 0) {
        // Si existe, actualizar el vehículo
        const updateQuery = `
          UPDATE vehicles 
          SET mileage = $1, color = $2, updated_at = CURRENT_TIMESTAMP
          WHERE license_plate = $3 AND owner_id = $4
          RETURNING *
        `;
        const result = await query(updateQuery, [
          vehicleData.mileage,
          vehicleData.color,
          vehicleData.license_plate,
          ownerId
        ]);
        return result.rows[0];
      } else {
        // Si no existe, crear nuevo vehículo
        const insertQuery = `
          INSERT INTO vehicles (
            owner_id, brand_id, model_id, license_plate, year, 
            color, mileage, fuel_type, transmission, engine_size
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `;
        const result = await query(insertQuery, [
          ownerId,
          vehicleData.brand_id,
          vehicleData.model_id,
          vehicleData.license_plate,
          vehicleData.year,
          vehicleData.color,
          vehicleData.mileage,
          vehicleData.fuel_type,
          vehicleData.transmission,
          vehicleData.engine_size
        ]);
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error al crear/actualizar vehículo:', error);
      throw error;
    }
  }

  // Obtener vehículo por patente
  static async getVehicleByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    try {
      const result = await query(
        'SELECT * FROM vehicles WHERE license_plate = $1',
        [licensePlate]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw error;
    }
  }
}

export class ListingService {
  // Crear una nueva publicación
  static async createListing(
    sellerId: number,
    vehicleId: number,
    listingData: CreateVehicleListingDTO
  ): Promise<VehicleListing> {
    try {
      const insertQuery = `
        INSERT INTO vehicle_listings (
          vehicle_id, seller_id, title, description, price, 
          listing_type, status, city_id, video_url, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      const title = `Vehículo ${listingData.license_plate}`;
      const description = listingData.observations || '';
      const listingType = listingData.listing_type || 'sale';

      const result = await query(insertQuery, [
        vehicleId,
        sellerId,
        title,
        description,
        listingData.price,
        listingType,
        'active',
        listingData.city_id,
        listingData.video_url
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error al crear publicación:', error);
      throw error;
    }
  }

  // Obtener publicaciones de un usuario
  static async getMyListings(userId: number): Promise<any[]> {
    try {
      const queryText = `
        SELECT 
          vl.*,
          v.license_plate,
          v.year,
          v.mileage,
          v.color,
          vb.name as brand_name,
          vm.name as model_name,
          c.name as city_name,
          r.name as region_name
        FROM vehicle_listings vl
        JOIN vehicles v ON vl.vehicle_id = v.id
        JOIN vehicle_brands vb ON v.brand_id = vb.id
        JOIN vehicle_models vm ON v.model_id = vm.id
        LEFT JOIN cities c ON vl.city_id = c.id
        LEFT JOIN regions r ON c.region_id = r.id
        WHERE vl.seller_id = $1 AND vl.status = 'active'
        ORDER BY vl.created_at DESC
      `;

      const result = await query(queryText, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  }

  // Obtener todas las publicaciones activas
  static async getAllActiveListings(): Promise<any[]> {
    try {
      const queryText = `
        SELECT 
          vl.*,
          v.license_plate,
          v.year,
          v.mileage,
          v.color,
          vb.name as brand_name,
          vm.name as model_name,
          c.name as city_name,
          r.name as region_name
        FROM vehicle_listings vl
        JOIN vehicles v ON vl.vehicle_id = v.id
        JOIN vehicle_brands vb ON v.brand_id = vb.id
        JOIN vehicle_models vm ON v.model_id = vm.id
        LEFT JOIN cities c ON vl.city_id = c.id
        LEFT JOIN regions r ON c.region_id = r.id
        WHERE vl.status = 'active'
        ORDER BY vl.created_at DESC
      `;

      const result = await query(queryText);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  }
}

export class RegionService {
  // Obtener todas las regiones
  static async getAllRegions(): Promise<any[]> {
    try {
      const result = await query('SELECT * FROM regions ORDER BY name');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener regiones:', error);
      throw error;
    }
  }

  // Obtener ciudades por región
  static async getCitiesByRegion(regionId: number): Promise<any[]> {
    try {
      const result = await query(
        'SELECT * FROM cities WHERE region_id = $1 ORDER BY name',
        [regionId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
      throw error;
    }
  }

  // Obtener todas las ciudades
  static async getAllCities(): Promise<any[]> {
    try {
      const result = await query(`
        SELECT c.*, r.name as region_name 
        FROM cities c
        JOIN regions r ON c.region_id = r.id
        ORDER BY r.name, c.name
      `);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
      throw error;
    }
  }
}

export class BrandService {
  // Obtener todas las marcas
  static async getAllBrands(): Promise<any[]> {
    try {
      const result = await query(
        'SELECT * FROM vehicle_brands WHERE is_active = true ORDER BY name'
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  }

  // Obtener modelos por marca
  static async getModelsByBrand(brandId: number): Promise<any[]> {
    try {
      const result = await query(
        'SELECT * FROM vehicle_models WHERE brand_id = $1 AND is_active = true ORDER BY name',
        [brandId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener modelos:', error);
      throw error;
    }
  }
}
