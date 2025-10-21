import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BotonAccion from '../components/BotonAccion';
import GrillaAutos from '../components/GrillaAutos';
import SliderMarcas from '../components/SliderMarcas';
import { Auto, MarcaAuto, Usuario } from '../types/auto';

const { width } = Dimensions.get('window');

export default function PantallaInicio() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario>({
    id: '1',
    nombre: 'USUARIO',
    saldo: 1230000,
  });

  const [autos, setAutos] = useState<Auto[]>([]);
  const [marcas, setMarcas] = useState<MarcaAuto[]>([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('en-venta');

  // Simulacion datos de la base de datos
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // Conectar con tu API de PostgreSQL
    const autosSimulados: Auto[] = [
      {
        id: '1',
        marca: 'Mazda',
        modelo: '2011 RM',
        año: 2011,
        precio: 5500000,
        imagen: 'https://via.placeholder.com/200x150/blue/white?text=Mazda',
        kilometraje: 80000,
        esFavorito: false,
        tieneInspeccion: true,
        esEconomico: true,
      },
      {
        id: '2',
        marca: 'Mazda',
        modelo: '2011 RM',
        año: 2011,
        precio: 5500000,
        imagen: 'https://via.placeholder.com/200x150/green/white?text=Mazda',
        kilometraje: 75000,
        esFavorito: true,
        tieneInspeccion: true,
        esEconomico: false,
      },
      {
        id: '3',
        marca: 'Mazda',
        modelo: '2013 Sport',
        año: 2013,
        precio: 6200000,
        imagen: 'https://via.placeholder.com/200x150/red/white?text=Mazda',
        kilometraje: 65000,
        esFavorito: false,
        tieneInspeccion: true,
        esEconomico: true,
      },
      {
        id: '4',
        marca: 'Chevrolet',
        modelo: 'Spark 2015',
        año: 2015,
        precio: 4800000,
        imagen: 'https://via.placeholder.com/200x150/orange/white?text=Chevrolet',
        kilometraje: 90000,
        esFavorito: true,
        tieneInspeccion: false,
        esEconomico: true,
      },
      {
        id: '5',
        marca: 'Hyundai',
        modelo: 'Accent 2018',
        año: 2018,
        precio: 7500000,
        imagen: 'https://via.placeholder.com/200x150/purple/white?text=Hyundai',
        kilometraje: 45000,
        esFavorito: false,
        tieneInspeccion: true,
        esEconomico: false,
      },
      {
        id: '6',
        marca: 'Nissan',
        modelo: 'Versa 2016',
        año: 2016,
        precio: 6800000,
        imagen: 'https://via.placeholder.com/200x150/brown/white?text=Nissan',
        kilometraje: 55000,
        esFavorito: true,
        tieneInspeccion: true,
        esEconomico: true,
      },
    ];

    const marcasSimuladas: MarcaAuto[] = [
      { id: '1', nombre: 'Mazda', logo: 'car' },
      { id: '2', nombre: 'Chevrolet', logo: 'car' },
      { id: '3', nombre: 'Hyundai', logo: 'car' },
      { id: '4', nombre: 'Nissan', logo: 'car' },
      { id: '5', nombre: 'Suzuki', logo: 'car' },
      { id: '6', nombre: 'Peugeot', logo: 'car' },
      { id: '7', nombre: 'Ford', logo: 'car' },
      { id: '8', nombre: 'KIA', logo: 'car' },
    ];

    setAutos(autosSimulados);
    setMarcas(marcasSimuladas);
  };

  const obtenerAutosFiltrados = () => {
    switch (seccionSeleccionada) {
      case 'favoritos':
        return autos.filter(auto => auto.esFavorito);
      case 'inspeccion':
        return autos.filter(auto => auto.tieneInspeccion);
      case 'economicos':
        return autos.filter(auto => auto.esEconomico);
      default:
        return autos;
    }
  };

  const manejarSolicitudMecanico = () => {
    router.push('/solicitar-mecanico');
  };

  const manejarRevisarInspeccion = () => {
    console.log('Revisar inspección');
    // Revisar inspección
  };

  const manejarVenderAuto = () => {
    console.log('Vender auto');
    // Vender auto
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Encabezado con info del usuario */}
        <View style={estilos.encabezado}>
          <View style={estilos.infoUsuario}>
            <View style={estilos.avatar}>
              <Ionicons name="person" size={30} color="#4CAF50" />
            </View>
            <View>
              <Text style={estilos.nombreUsuario}>{usuario.nombre}</Text>
              <Text style={estilos.saldoUsuario}>
                SALDO $ {usuario.saldo.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={estilos.accionesEncabezado}>
            <TouchableOpacity style={estilos.botonMensajes}>
              <Ionicons name="chatbubble-outline" size={24} color="#4CAF50" />
              <View style={estilos.insigniaMensajes}>
                <Text style={estilos.textoInsigniaMensajes}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logo */}
        <View style={estilos.contenedorLogo}>
          <Text style={estilos.textoLogo}>
            <Text style={estilos.logoGood}>Good</Text>
            <Text style={estilos.logoCars}>Cars</Text>
          </Text>
          <Ionicons name="car" size={40} color="#4CAF50" />
        </View>

        {/* Botones de acción principales */}
        <View style={estilos.botonesAccion}>
          <BotonAccion
            icono="construct"
            etiqueta="SOLICITAR MECÁNICO"
            alPresionar={manejarSolicitudMecanico}
          />
          <BotonAccion
            icono="search"
            etiqueta="REVISAR INSPECCIÓN"
            alPresionar={manejarRevisarInspeccion}
          />
          <BotonAccion
            icono="car"
            etiqueta="VENDER MI AUTO"
            alPresionar={manejarVenderAuto}
          />
        </View>

        {/* Slider de marcas */}
        <SliderMarcas marcas={marcas} />

        {/* Secciones de autos */}
        <View style={estilos.contenedorSecciones}>
          <View style={estilos.encabezadoSeccion}>
            <Text style={estilos.tituloSeccion}>MIS AUTOS EN VENTA</Text>
          </View>
          <GrillaAutos autos={obtenerAutosFiltrados()} />

          <View style={estilos.encabezadoSeccion}>
            <Text style={estilos.tituloSeccion}>MIS FAVORITOS</Text>
          </View>
          <GrillaAutos autos={autos.filter(auto => auto.esFavorito)} />

          <View style={estilos.encabezadoSeccion}>
            <Text style={estilos.tituloSeccion}>PUBLICADOS CON INSPECCIÓN MECÁNICA</Text>
          </View>
          <GrillaAutos autos={autos.filter(auto => auto.tieneInspeccion)} />

          <View style={estilos.encabezadoSeccion}>
            <Text style={estilos.tituloSeccion}>ÚLTIMOS PUBLICADOS</Text>
          </View>
          <GrillaAutos autos={autos.slice(0, 6)} />

          <View style={estilos.encabezadoSeccion}>
            <Text style={estilos.tituloSeccion}>ECONÓMICOS Y RENDIDORES</Text>
          </View>
          <GrillaAutos autos={autos.filter(auto => auto.esEconomico)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nombreUsuario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  saldoUsuario: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  accionesEncabezado: {
    position: 'relative',
  },
  botonMensajes: {
    padding: 8,
  },
  insigniaMensajes: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoInsigniaMensajes: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contenedorLogo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  textoLogo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoGood: {
    color: '#333',
  },
  logoCars: {
    color: '#4CAF50',
  },
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  contenedorSecciones: {
    padding: 16,
  },
  encabezadoSeccion: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  tituloSeccion: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});