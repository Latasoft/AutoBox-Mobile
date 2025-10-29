import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface Inspeccion {
  id_publicacion: number;
  patente: string;
  marca: string;
  modelo: string;
  año: number;
  fecha_revision: string;
  hora_revision: string;
  autobox_nombre: string;
  autobox_direccion: string;
  estado: string;
  created_at: string;
}

export default function Inspecciones() {
  const router = useRouter();
  const { user } = useAuth();
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargarInspecciones();
    }, [])
  );

  const cargarInspecciones = async () => {
    try {
      setCargando(true);
      const response = await fetch(`http://localhost:3000/api/publicaciones/inspecciones/${user?.id}`);
      const data = await response.json();
      setInspecciones(data);
    } catch (error) {
      console.error('Error cargando inspecciones:', error);
      setInspecciones([]);
    } finally {
      setCargando(false);
    }
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return '#FFA726';
      case 'aprobada':
        return '#4CAF50';
      case 'rechazada':
        return '#FF5722';
      default:
        return '#999';
    }
  };

  const obtenerIconoEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'time-outline';
      case 'aprobada':
        return 'checkmark-circle';
      case 'rechazada':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      {/* Encabezado */}
      <View style={estilos.encabezado}>
        <TouchableOpacity
          style={estilos.botonVolver}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={estilos.logoContainer}>
          <Text style={estilos.logo}>
            <Text style={estilos.textoGood}>Good</Text>
            <Text style={estilos.textoCars}>Cars</Text>
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={estilos.tituloSeccion}>
        <Ionicons name="construct" size={28} color="#4CAF50" />
        <Text style={estilos.titulo}>MIS INSPECCIONES</Text>
      </View>

      <ScrollView style={estilos.contenido}>
        {cargando ? (
          <View style={estilos.cargandoContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={estilos.textoCargando}>Cargando inspecciones...</Text>
          </View>
        ) : inspecciones.length === 0 ? (
          <View style={estilos.sinDatos}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={estilos.textoSinDatos}>
              No tienes inspecciones programadas
            </Text>
            <Text style={estilos.subtextoSinDatos}>
              Solicita una revisión mecánica para ver tus inspecciones aquí
            </Text>
            <TouchableOpacity
              style={estilos.botonSolicitar}
              onPress={() => router.push('/publicacion-con-revision')}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={estilos.textoBotonSolicitar}>
                Solicitar Inspección
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          inspecciones.map((inspeccion) => (
            <View key={inspeccion.id_publicacion} style={estilos.tarjeta}>
              <View style={estilos.tarjetaEncabezado}>
                <View style={estilos.infoVehiculo}>
                  <Ionicons name="car-sport" size={24} color="#4CAF50" />
                  <View style={estilos.datosVehiculo}>
                    <Text style={estilos.marcaModelo}>
                      {inspeccion.marca} {inspeccion.modelo}
                    </Text>
                    <Text style={estilos.patente}>
                      Patente: {inspeccion.patente}
                    </Text>
                    <Text style={estilos.año}>Año: {inspeccion.año}</Text>
                  </View>
                </View>
                <View
                  style={[
                    estilos.estadoBadge,
                    { backgroundColor: obtenerColorEstado(inspeccion.estado) },
                  ]}
                >
                  <Ionicons
                    name={obtenerIconoEstado(inspeccion.estado) as any}
                    size={16}
                    color="#fff"
                  />
                  <Text style={estilos.textoEstado}>
                    {inspeccion.estado.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={estilos.divisor} />

              <View style={estilos.detallesInspeccion}>
                <View style={estilos.detalleFila}>
                  <Ionicons name="calendar" size={18} color="#666" />
                  <Text style={estilos.detalleTexto}>
                    Fecha: {inspeccion.fecha_revision || 'Por confirmar'}
                  </Text>
                </View>

                <View style={estilos.detalleFila}>
                  <Ionicons name="time" size={18} color="#666" />
                  <Text style={estilos.detalleTexto}>
                    Hora: {inspeccion.hora_revision || 'Por confirmar'}
                  </Text>
                </View>

                <View style={estilos.detalleFila}>
                  <Ionicons name="location" size={18} color="#666" />
                  <Text style={estilos.detalleTexto}>
                    {inspeccion.autobox_nombre || 'AutoBox'}
                  </Text>
                </View>

                {inspeccion.autobox_direccion && (
                  <View style={estilos.detalleFila}>
                    <Ionicons name="map" size={18} color="#666" />
                    <Text style={estilos.detalleTexto}>
                      {inspeccion.autobox_direccion}
                    </Text>
                  </View>
                )}
              </View>

              <View style={estilos.tarjetaPie}>
                <Text style={estilos.fechaCreacion}>
                  Solicitada: {new Date(inspeccion.created_at).toLocaleDateString('es-CL')}
                </Text>
              </View>
            </View>
          ))
        )}
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  botonVolver: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textoGood: {
    color: '#333',
  },
  textoCars: {
    color: '#4CAF50',
  },
  tituloSeccion: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    gap: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contenido: {
    flex: 1,
    padding: 15,
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  textoCargando: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  sinDatos: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  textoSinDatos: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  subtextoSinDatos: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  botonSolicitar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 30,
    gap: 8,
  },
  textoBotonSolicitar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tarjetaEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoVehiculo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  datosVehiculo: {
    flex: 1,
  },
  marcaModelo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  patente: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  año: {
    fontSize: 14,
    color: '#666',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  textoEstado: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divisor: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  detallesInspeccion: {
    gap: 10,
  },
  detalleFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detalleTexto: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  tarjetaPie: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  fechaCreacion: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});
