import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
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
import { useAuth } from '../contexts/AuthContext';
import { Auto, MarcaAuto } from '../types/auto';

const { width } = Dimensions.get('window');

export default function PantallaInicio() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [autos, setAutos] = useState<Auto[]>([]);
  const [marcas, setMarcas] = useState<MarcaAuto[]>([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('en-venta');

  // Cargar datos cada vez que se enfoca la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      // Cargar publicaciones del usuario desde la base de datos
      const response = await fetch('http://localhost:3000/api/publicaciones');
      const publicaciones = await response.json();
      
      // Convertir publicaciones a formato Auto
      const autosDesdeDB: Auto[] = publicaciones.map((pub: any, index: number) => ({
        id: pub.id_publicacion.toString(),
        marca: pub.marca || 'Sin marca',
        modelo: pub.modelo || 'Sin modelo',
        año: pub.año || new Date().getFullYear(),
        precio: pub.precio_venta || 0,
        imagen: `https://via.placeholder.com/200x150/4CAF50/white?text=${encodeURIComponent(pub.marca || 'Auto')}+${encodeURIComponent(pub.modelo || '')}`,
        kilometraje: pub.kilometraje || 0,
        esFavorito: false,
        tieneInspeccion: pub.tipo_publicacion === 'con_revision',
        esEconomico: pub.precio_venta < 6000000,
        patente: pub.patente,
      }));

      console.log('Publicaciones cargadas:', autosDesdeDB.length);

      // Solo usar publicaciones de la base de datos
      setAutos(autosDesdeDB);

      // Extraer marcas únicas de las publicaciones
      const marcasUnicas = Array.from(new Set(autosDesdeDB.map(auto => auto.marca)))
        .filter(marca => marca && marca !== 'Sin marca')
        .map((marca, index) => ({
          id: (index + 1).toString(),
          nombre: marca,
          logo: 'car' as const
        }));

      setMarcas(marcasUnicas);
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
      setAutos([]);
      setMarcas([]);
    }
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
    router.push('/inspecciones');
  };

  const manejarVenderAuto = () => {
    console.log('Vender auto - Navegando a vender-auto');
    router.push('/vender-auto');
  };

  const manejarCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Encabezado con info del usuario */}
        <View style={estilos.encabezado}>
          <View style={estilos.infoUsuario}>
            <View style={estilos.avatar}>
              <Ionicons name="person-circle" size={50} color="#4CAF50" />
            </View>
            <View>
              <Text style={estilos.nombreUsuario}>{user?.name || 'Usuario'}</Text>
              <Text style={estilos.saldoUsuario}>
                💰 SALDO $ {user?.balance?.toLocaleString() || '0'}
              </Text>
            </View>
          </View>
          <View style={estilos.accionesEncabezado}>
            <TouchableOpacity style={estilos.botonMensajes}>
              <Ionicons name="chatbubbles" size={28} color="#4CAF50" />
              <View style={estilos.insigniaMensajes}>
                <Text style={estilos.textoInsigniaMensajes}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={estilos.botonLogout}
              onPress={manejarCerrarSesion}
            >
              <Ionicons name="log-out-outline" size={28} color="#FF5722" />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botonMensajes: {
    padding: 8,
    position: 'relative',
  },
  botonLogout: {
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