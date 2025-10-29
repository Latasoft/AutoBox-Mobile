import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { BrandService, ListingService, RegionService, VehicleService } from '../services/vehicleService';
import { CreateVehicleListingDTO } from '../types';

const router = express.Router();

// Extender el tipo Request para incluir file de multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configurar multer para subir videos
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 60 * 1024 * 1024 // 60 MB máximo
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /mp4|mov|avi|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de video (mp4, mov, avi, mkv)'));
    }
  }
});

// POST: Crear nueva publicación
router.post('/listings', upload.single('video'), async (req: MulterRequest, res: Response) => {
  try {
    const {
      price,
      license_plate,
      mileage,
      city_id,
      observations,
      brand_id,
      model_id,
      year,
      color,
      fuel_type,
      transmission
    } = req.body;

    // Obtener el userId del request (esto vendría del middleware de autenticación)
    const userId = req.body.user_id || 1; // Por ahora usamos 1 como default

    // Validaciones básicas
    if (!price || !license_plate || !mileage || !city_id) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: price, license_plate, mileage, city_id'
      });
    }

    // URL del video si se subió
    let videoUrl: string | undefined = undefined;
    if (req.file) {
      videoUrl = `/uploads/videos/${req.file.filename}`;
    }

    // Verificar si el vehículo ya existe o crear uno nuevo
    let vehicle = await VehicleService.getVehicleByLicensePlate(license_plate);
    
    if (!vehicle) {
      // Si no existe, necesitamos los datos del vehículo
      if (!brand_id || !model_id || !year || !fuel_type || !transmission) {
        return res.status(400).json({
          success: false,
          message: 'Para un vehículo nuevo se requieren: brand_id, model_id, year, fuel_type, transmission'
        });
      }

      vehicle = await VehicleService.createOrUpdateVehicle(userId, {
        brand_id: parseInt(brand_id),
        model_id: parseInt(model_id),
        license_plate,
        year: parseInt(year),
        color,
        mileage: parseInt(mileage),
        fuel_type,
        transmission
      });
    }

    // Crear la publicación
    const listingData: CreateVehicleListingDTO = {
      price: parseFloat(price),
      license_plate,
      mileage: parseInt(mileage),
      city_id: parseInt(city_id),
      observations,
      video_url: videoUrl,
      listing_type: 'sale'
    };

    const listing = await ListingService.createListing(userId, vehicle.id, listingData);

    res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente',
      data: {
        listing,
        vehicle
      }
    });

  } catch (error: any) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la publicación',
      error: error.message
    });
  }
});

// GET: Obtener mis publicaciones
router.get('/listings/my-listings', async (req: Request, res: Response) => {
  try {
    // Obtener el userId del request (esto vendría del middleware de autenticación)
    const userId = parseInt(req.query.user_id as string) || 1; // Por ahora usamos 1 como default

    const listings = await ListingService.getMyListings(userId);

    res.status(200).json({
      success: true,
      data: listings
    });

  } catch (error: any) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las publicaciones',
      error: error.message
    });
  }
});

// GET: Obtener todas las publicaciones activas
router.get('/listings', async (req: Request, res: Response) => {
  try {
    const listings = await ListingService.getAllActiveListings();

    res.status(200).json({
      success: true,
      data: listings
    });

  } catch (error: any) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las publicaciones',
      error: error.message
    });
  }
});

// GET: Obtener regiones
router.get('/regions', async (req: Request, res: Response) => {
  try {
    const regions = await RegionService.getAllRegions();

    res.status(200).json({
      success: true,
      data: regions
    });

  } catch (error: any) {
    console.error('Error al obtener regiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las regiones',
      error: error.message
    });
  }
});

// GET: Obtener ciudades por región
router.get('/regions/:regionId/cities', async (req: Request, res: Response) => {
  try {
    const regionId = parseInt(req.params.regionId);
    const cities = await RegionService.getCitiesByRegion(regionId);

    res.status(200).json({
      success: true,
      data: cities
    });

  } catch (error: any) {
    console.error('Error al obtener ciudades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ciudades',
      error: error.message
    });
  }
});

// GET: Obtener todas las ciudades
router.get('/cities', async (req: Request, res: Response) => {
  try {
    const cities = await RegionService.getAllCities();

    res.status(200).json({
      success: true,
      data: cities
    });

  } catch (error: any) {
    console.error('Error al obtener ciudades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ciudades',
      error: error.message
    });
  }
});

// GET: Obtener marcas
router.get('/brands', async (req: Request, res: Response) => {
  try {
    const brands = await BrandService.getAllBrands();

    res.status(200).json({
      success: true,
      data: brands
    });

  } catch (error: any) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las marcas',
      error: error.message
    });
  }
});

// GET: Obtener modelos por marca
router.get('/brands/:brandId/models', async (req: Request, res: Response) => {
  try {
    const brandId = parseInt(req.params.brandId);
    const models = await BrandService.getModelsByBrand(brandId);

    res.status(200).json({
      success: true,
      data: models
    });

  } catch (error: any) {
    console.error('Error al obtener modelos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los modelos',
      error: error.message
    });
  }
});

export default router;
