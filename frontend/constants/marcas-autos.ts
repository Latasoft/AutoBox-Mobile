// Lista completa de marcas de autos
export const marcasAutos = [
  'Acura',
  'Alfa Romeo',
  'Aston Martin',
  'Audi',
  'Bentley',
  'BMW',
  'Buick',
  'Cadillac',
  'Changan',
  'Chery',
  'Chevrolet',
  'Chrysler',
  'Citroën',
  'Dacia',
  'Daewoo',
  'Daihatsu',
  'Dodge',
  'Ferrari',
  'Fiat',
  'Ford',
  'Foton',
  'Geely',
  'Genesis',
  'GMC',
  'Great Wall',
  'Haval',
  'Honda',
  'Hummer',
  'Hyundai',
  'Infiniti',
  'Isuzu',
  'Jaguar',
  'Jeep',
  'Kia',
  'Lamborghini',
  'Lancia',
  'Land Rover',
  'Lexus',
  'Lincoln',
  'Lotus',
  'Maserati',
  'Mazda',
  'McLaren',
  'Mercedes-Benz',
  'MG',
  'Mini',
  'Mitsubishi',
  'Nissan',
  'Opel',
  'Peugeot',
  'Pontiac',
  'Porsche',
  'RAM',
  'Renault',
  'Rolls-Royce',
  'Rover',
  'Saab',
  'Saturn',
  'Seat',
  'Škoda',
  'Smart',
  'SsangYong',
  'Subaru',
  'Suzuki',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
].sort();

// Función para obtener el año actual
export const obtenerAñoActual = (): number => {
  return new Date().getFullYear();
};

// Función para generar rango de años desde 1990 hasta el año actual
export const generarRangoAños = (): number[] => {
  const añoActual = obtenerAñoActual();
  const años: number[] = [];
  
  for (let año = añoActual; año >= 1990; año--) {
    años.push(año);
  }
  
  return años;
};
