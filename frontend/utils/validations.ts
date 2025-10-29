/**
 * Sistema de Validaciones Centralizado para AutoBox
 * Contiene todas las validaciones de la aplicación
 */

// ============================================================================
// TIPOS DE VALIDACIÓN
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// ============================================================================
// VALIDACIONES DE PATENTE
// ============================================================================

/**
 * Valida patente chilena formato antiguo: BBCD12 (4 letras + 2 números)
 */
export const validatePatenteAntigua = (patente: string): ValidationResult => {
  const patenteUpper = patente.toUpperCase().trim();
  
  // Formato: 4 letras seguidas de 2 números
  const regex = /^[A-Z]{4}\d{2}$/;
  
  if (!patente) {
    return { isValid: false, message: 'La patente es obligatoria' };
  }
  
  if (patente.length !== 6) {
    return { isValid: false, message: 'La patente debe tener 6 caracteres' };
  }
  
  if (!regex.test(patenteUpper)) {
    return { isValid: false, message: 'Formato inválido. Use 4 letras y 2 números (ej: BBCD12)' };
  }
  
  return { isValid: true };
};

/**
 * Valida patente chilena formato nuevo: BBBB12 (4 letras + 2 números) o BB1234 (2 letras + 4 números)
 */
export const validatePatenteNueva = (patente: string): ValidationResult => {
  const patenteUpper = patente.toUpperCase().trim();
  
  // Formato nuevo: 4 letras + 2 números o 2 letras + 4 números
  const regex = /^([A-Z]{4}\d{2}|[A-Z]{2}\d{4})$/;
  
  if (!patente) {
    return { isValid: false, message: 'La patente es obligatoria' };
  }
  
  if (patente.length !== 6) {
    return { isValid: false, message: 'La patente debe tener 6 caracteres' };
  }
  
  if (!regex.test(patenteUpper)) {
    return { isValid: false, message: 'Formato inválido. Use 4 letras+2 números o 2 letras+4 números' };
  }
  
  return { isValid: true };
};

/**
 * Valida cualquier formato de patente chilena (antiguo o nuevo)
 */
export const validatePatente = (patente: string): ValidationResult => {
  const resultAntiguo = validatePatenteAntigua(patente);
  const resultNuevo = validatePatenteNueva(patente);
  
  if (resultAntiguo.isValid || resultNuevo.isValid) {
    return { isValid: true };
  }
  
  return { 
    isValid: false, 
    message: 'Formato de patente inválido. Formatos válidos: BBCD12 (4 letras+2 números) o BB1234 (2 letras+4 números)' 
  };
};

// ============================================================================
// VALIDACIONES DE RUT
// ============================================================================

/**
 * Valida RUT chileno con formato y dígito verificador
 */
export const validateRUT = (rut: string): ValidationResult => {
  if (!rut) {
    return { isValid: false, message: 'El RUT es obligatorio' };
  }
  
  // Limpiar el RUT
  const rutLimpio = rut.replace(/[.\-]/g, '');
  
  // Verificar formato básico
  const regex = /^(\d{1,8})([0-9Kk])$/;
  const match = rutLimpio.match(regex);
  
  if (!match) {
    return { isValid: false, message: 'Formato de RUT inválido. Use: 12345678-9' };
  }
  
  const numero = match[1];
  const dv = match[2].toUpperCase();
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
  
  if (dv !== dvEsperado) {
    return { isValid: false, message: 'El RUT ingresado no es válido' };
  }
  
  return { isValid: true };
};

/**
 * Formatea RUT con puntos y guión
 */
export const formatRUT = (rut: string): string => {
  const rutLimpio = rut.replace(/[^\dKk]/g, '');
  
  if (rutLimpio.length <= 1) return rutLimpio;
  
  const dv = rutLimpio.slice(-1);
  let numero = rutLimpio.slice(0, -1);
  
  // Agregar puntos cada 3 dígitos
  numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${numero}-${dv}`;
};

// ============================================================================
// VALIDACIONES DE PRECIO
// ============================================================================

/**
 * Valida precio de vehículo
 */
export const validatePrecio = (precio: string | number): ValidationResult => {
  const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio;
  
  if (!precio || isNaN(precioNum)) {
    return { isValid: false, message: 'El precio es obligatorio' };
  }
  
  if (precioNum <= 0) {
    return { isValid: false, message: 'El precio debe ser mayor a 0' };
  }
  
  if (precioNum < 100000) {
    return { isValid: false, message: 'El precio parece muy bajo. Mínimo $100.000' };
  }
  
  if (precioNum > 999999999) {
    return { isValid: false, message: 'El precio excede el máximo permitido' };
  }
  
  return { isValid: true };
};

/**
 * Formatea precio chileno con separador de miles
 */
export const formatPrecio = (precio: number | string): string => {
  const precioNum = typeof precio === 'string' ? parseFloat(precio.replace(/[^\d]/g, '')) : precio;
  
  if (isNaN(precioNum)) return '';
  
  return `$${precioNum.toLocaleString('es-CL')}`;
};

// ============================================================================
// VALIDACIONES DE KILOMETRAJE
// ============================================================================

/**
 * Valida kilometraje del vehículo
 */
export const validateKilometraje = (km: string | number): ValidationResult => {
  const kmNum = typeof km === 'string' ? parseInt(km) : km;
  
  if (!km || isNaN(kmNum)) {
    return { isValid: false, message: 'El kilometraje es obligatorio' };
  }
  
  if (kmNum < 0) {
    return { isValid: false, message: 'El kilometraje no puede ser negativo' };
  }
  
  if (kmNum > 999999) {
    return { isValid: false, message: 'El kilometraje parece muy alto' };
  }
  
  return { isValid: true };
};

/**
 * Formatea kilometraje con separador de miles
 */
export const formatKilometraje = (km: number | string): string => {
  const kmNum = typeof km === 'string' ? parseInt(km.replace(/[^\d]/g, '')) : km;
  
  if (isNaN(kmNum)) return '';
  
  return `${kmNum.toLocaleString('es-CL')} km`;
};

// ============================================================================
// VALIDACIONES DE EMAIL
// ============================================================================

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'El email es obligatorio' };
  }
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!regex.test(email)) {
    return { isValid: false, message: 'El formato del email no es válido' };
  }
  
  return { isValid: true };
};

// ============================================================================
// VALIDACIONES DE TELÉFONO
// ============================================================================

/**
 * Valida teléfono chileno (+56 9 XXXX XXXX)
 */
export const validateTelefono = (telefono: string): ValidationResult => {
  if (!telefono) {
    return { isValid: false, message: 'El teléfono es obligatorio' };
  }
  
  // Limpiar el teléfono
  const telefonoLimpio = telefono.replace(/[\s\-\+]/g, '');
  
  // Formato chileno: 569XXXXXXXX (11 dígitos) o 9XXXXXXXX (9 dígitos)
  const regex = /^(569?\d{8})$/;
  
  if (!regex.test(telefonoLimpio)) {
    return { isValid: false, message: 'Formato inválido. Use: +56 9 XXXX XXXX' };
  }
  
  return { isValid: true };
};

/**
 * Formatea teléfono chileno
 */
export const formatTelefono = (telefono: string): string => {
  const telefonoLimpio = telefono.replace(/\D/g, '');
  
  if (telefonoLimpio.length === 9) {
    // Formato: 9 XXXX XXXX
    return `+56 ${telefonoLimpio[0]} ${telefonoLimpio.slice(1, 5)} ${telefonoLimpio.slice(5)}`;
  }
  
  if (telefonoLimpio.length === 11 && telefonoLimpio.startsWith('56')) {
    // Formato: 56 9 XXXX XXXX
    return `+${telefonoLimpio.slice(0, 2)} ${telefonoLimpio[2]} ${telefonoLimpio.slice(3, 7)} ${telefonoLimpio.slice(7)}`;
  }
  
  return telefono;
};

// ============================================================================
// VALIDACIONES DE AÑO
// ============================================================================

/**
 * Valida año del vehículo
 */
export const validateAño = (año: string | number): ValidationResult => {
  const añoNum = typeof año === 'string' ? parseInt(año) : año;
  const añoActual = new Date().getFullYear();
  
  if (!año || isNaN(añoNum)) {
    return { isValid: false, message: 'El año es obligatorio' };
  }
  
  if (añoNum < 1900) {
    return { isValid: false, message: 'El año es muy antiguo' };
  }
  
  if (añoNum > añoActual + 1) {
    return { isValid: false, message: 'El año no puede ser futuro' };
  }
  
  return { isValid: true };
};

// ============================================================================
// VALIDACIONES DE ARCHIVO
// ============================================================================

/**
 * Valida tamaño de archivo (video)
 */
export const validateFileSize = (
  size: number, 
  maxSizeMB: number = 60
): ValidationResult => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (size > maxSizeBytes) {
    return { 
      isValid: false, 
      message: `El archivo excede el tamaño máximo de ${maxSizeMB}MB` 
    };
  }
  
  return { isValid: true };
};

/**
 * Valida tipo de archivo (video)
 */
export const validateVideoType = (mimeType: string): ValidationResult => {
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
  
  if (!allowedTypes.includes(mimeType)) {
    return { 
      isValid: false, 
      message: 'Formato no permitido. Use: MP4, MOV, AVI o MKV' 
    };
  }
  
  return { isValid: true };
};

// ============================================================================
// VALIDACIONES DE CAMPO REQUERIDO
// ============================================================================

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (
  value: any, 
  fieldName: string = 'Este campo'
): ValidationResult => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: `${fieldName} es obligatorio` };
  }
  
  return { isValid: true };
};

// ============================================================================
// VALIDACIONES DE LONGITUD
// ============================================================================

/**
 * Valida longitud mínima de texto
 */
export const validateMinLength = (
  value: string, 
  minLength: number, 
  fieldName: string = 'Este campo'
): ValidationResult => {
  if (value.length < minLength) {
    return { 
      isValid: false, 
      message: `${fieldName} debe tener al menos ${minLength} caracteres` 
    };
  }
  
  return { isValid: true };
};

/**
 * Valida longitud máxima de texto
 */
export const validateMaxLength = (
  value: string, 
  maxLength: number, 
  fieldName: string = 'Este campo'
): ValidationResult => {
  if (value.length > maxLength) {
    return { 
      isValid: false, 
      message: `${fieldName} no puede superar ${maxLength} caracteres` 
    };
  }
  
  return { isValid: true };
};

// ============================================================================
// VALIDACIÓN DE FORMULARIO COMPLETO
// ============================================================================

export interface FormData {
  [key: string]: any;
}

export interface FormValidationRules {
  [key: string]: (value: any) => ValidationResult;
}

/**
 * Valida un formulario completo
 */
export const validateForm = (
  formData: FormData, 
  rules: FormValidationRules
): { isValid: boolean; errors: { [key: string]: string } } => {
  const errors: { [key: string]: string } = {};
  
  for (const field in rules) {
    const result = rules[field](formData[field]);
    if (!result.isValid && result.message) {
      errors[field] = result.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
