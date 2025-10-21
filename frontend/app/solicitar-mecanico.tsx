import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Auto } from '../types/auto';

export default function SolicitarMecanico() {
  const router = useRouter();
  const [patente, setPatente] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [autobox, setAutobox] = useState('');
  const [rut, setRut] = useState('');
  const [fono, setFono] = useState('');
  const [mail, setMail] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [autosDisponibles, setAutosDisponibles] = useState<Auto[]>([]);
  const [mostrarModalPatente, setMostrarModalPatente] = useState(false);

  // Cargar autos desde la base de datos
  useEffect(() => {
    cargarAutosDisponibles();
  }, []);

  const cargarAutosDisponibles = async () => {
    // Aquí conectarías con tu API real
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
        patente: 'AB-1234',
      },
      {
        id: '2',
        marca: 'Chevrolet',
        modelo: 'Spark 2015',
        año: 2015,
        precio: 4800000,
        imagen: 'https://via.placeholder.com/200x150/orange/white?text=Chevrolet',
        kilometraje: 90000,
        esFavorito: true,
        tieneInspeccion: false,
        esEconomico: true,
        patente: 'CD-5678',
      },
      {
        id: '3',
        marca: 'Hyundai',
        modelo: 'Accent 2018',
        año: 2018,
        precio: 7500000,
        imagen: 'https://via.placeholder.com/200x150/purple/white?text=Hyundai',
        kilometraje: 45000,
        esFavorito: false,
        tieneInspeccion: true,
        esEconomico: false,
        patente: 'EF-9012',
      },
      {
        id: '4',
        marca: 'Nissan',
        modelo: 'Versa 2016',
        año: 2016,
        precio: 6800000,
        imagen: 'https://via.placeholder.com/200x150/brown/white?text=Nissan',
        kilometraje: 55000,
        esFavorito: true,
        tieneInspeccion: true,
        esEconomico: true,
        patente: 'GH-3456',
      },
    ];

    setAutosDisponibles(autosSimulados);
  };

  const seleccionarPatente = (auto: Auto) => {
    setPatente(`${auto.patente} - ${auto.marca} ${auto.modelo}`);
    setMostrarModalPatente(false);
  };

  const manejarSolicitud = () => {
    if (!patente || !fecha || !hora || !autobox || !rut || !fono || !mail) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!aceptaTerminos) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }

    Alert.alert(
      'Solicitud Enviada',
      'Tu solicitud de mecánico ha sido enviada exitosamente',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderItemPatente = ({ item }: { item: Auto }) => (
    <TouchableOpacity
      style={estilos.itemPatente}
      onPress={() => seleccionarPatente(item)}
    >
      <View style={estilos.infoPatente}>
        <Text style={estilos.textoPatente}>{item.patente}</Text>
        <Text style={estilos.textoVehiculo}>{item.marca} {item.modelo} ({item.año})</Text>
        <Text style={estilos.textoKilometraje}>{item.kilometraje.toLocaleString()} km</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={estilos.encabezado}>
          <TouchableOpacity 
            style={estilos.botonRegresar} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={estilos.titulo}>Solicitar Mecánico</Text>
        </View>

        {/* Logo */}
        <View style={estilos.contenedorLogo}>
          <View style={estilos.logoContainer}>
            <Ionicons name="car" size={40} color="#4CAF50" />
            <Text style={estilos.textoLogo}>
              <Text style={estilos.logoGood}>Good</Text>
              <Text style={estilos.logoCars}>Cars</Text>
            </Text>
          </View>
          <Text style={estilos.subtitulo}>SOLICITAR MECÁNICO</Text>
          <Text style={estilos.descripcion}>
            DESCRIPCIÓN DEL SERVICIO DE{'\n'}REVISIÓN AUTOMOTRIZ
          </Text>
          <View style={estilos.iconoPlay}>
            <Ionicons name="play-circle" size={40} color="#4CAF50" />
          </View>
        </View>

        {/* Formulario */}
        <View style={estilos.formulario}>
          <Text style={estilos.etiquetaCampo}>PATENTE</Text>
          <TouchableOpacity 
            style={estilos.campoSeleccion}
            onPress={() => setMostrarModalPatente(true)}
          >
            <Text style={[estilos.textoSeleccion, patente ? estilos.textoSeleccionado : null]}>
              {patente || 'SELECCIONAR VEHÍCULO'}
            </Text>
            <Ionicons name="car-outline" size={20} color="#666" />
          </TouchableOpacity>

          <View style={estilos.filaFechaHora}>
            <View style={estilos.columnaFecha}>
              <Text style={estilos.etiquetaCampo}>FECHA</Text>
              <TouchableOpacity style={estilos.campoSeleccion}>
                <Text style={estilos.textoSeleccion}>
                  {fecha || 'SELECCIONAR'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={estilos.columnaHora}>
              <Text style={estilos.etiquetaCampo}>HORA</Text>
              <TouchableOpacity style={estilos.campoSeleccion}>
                <Text style={estilos.textoSeleccion}>
                  {hora || 'SELECCIONAR'}
                </Text>
                <Ionicons name="time-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={estilos.etiquetaCampo}>AUTOBOX</Text>
          <TouchableOpacity style={estilos.campoSeleccion}>
            <Text style={estilos.textoSeleccion}>
              {autobox || 'SELECCIONAR'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={estilos.etiquetaCampo}>RUT</Text>
          <TextInput
            style={estilos.campoTexto}
            value={rut}
            onChangeText={setRut}
            placeholder=""
            keyboardType="numeric"
          />

          <Text style={estilos.etiquetaCampo}>FONO</Text>
          <TextInput
            style={estilos.campoTexto}
            value={fono}
            onChangeText={setFono}
            placeholder=""
            keyboardType="phone-pad"
          />

          <Text style={estilos.etiquetaCampo}>MAIL</Text>
          <TextInput
            style={estilos.campoTexto}
            value={mail}
            onChangeText={setMail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Términos y condiciones */}
          <TouchableOpacity 
            style={estilos.contenedorTerminos}
            onPress={() => setAceptaTerminos(!aceptaTerminos)}
          >
            <View style={[estilos.checkbox, aceptaTerminos && estilos.checkboxSeleccionado]}>
              {aceptaTerminos && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={estilos.textoTerminos}>
              Acepto términos y condiciones
            </Text>
          </TouchableOpacity>

          {/* Botón solicitar */}
          <TouchableOpacity 
            style={estilos.botonSolicitar}
            onPress={manejarSolicitud}
          >
            <Text style={estilos.textoBotonSolicitar}>SOLICITAR</Text>
          </TouchableOpacity>
        </View>

        {/* Botones de navegación inferior */}
        <View style={estilos.navegacionInferior}>
          <TouchableOpacity 
            style={estilos.botonNavegacion}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-circle" size={50} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={estilos.botonNavegacion}
            onPress={() => router.push('/home')}
          >
            <Ionicons name="home" size={50} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Modal para seleccionar patente */}
        <Modal
          visible={mostrarModalPatente}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setMostrarModalPatente(false)}
        >
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalContenido}>
              <View style={estilos.modalHeader}>
                <Text style={estilos.modalTitulo}>Seleccionar Vehículo</Text>
                <TouchableOpacity
                  onPress={() => setMostrarModalPatente(false)}
                  style={estilos.botonCerrarModal}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={autosDisponibles}
                renderItem={renderItemPatente}
                keyExtractor={(item) => item.id}
                style={estilos.listaPatentes}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    flex: 1,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botonRegresar: {
    padding: 8,
    marginRight: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contenedorLogo: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoLogo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoGood: {
    color: '#333',
  },
  logoCars: {
    color: '#4CAF50',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  iconoPlay: {
    marginBottom: 10,
  },
  formulario: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  etiquetaCampo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  campoTexto: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  filaFechaHora: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnaFecha: {
    flex: 1,
    marginRight: 10,
  },
  columnaHora: {
    flex: 1,
    marginLeft: 10,
  },
  campoSeleccion: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textoSeleccion: {
    fontSize: 16,
    color: '#999',
  },
  textoSeleccionado: {
    color: '#333',
  },
  contenedorTerminos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSeleccionado: {
    backgroundColor: '#4CAF50',
  },
  textoTerminos: {
    fontSize: 14,
    color: '#4CAF50',
  },
  botonSolicitar: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },
  textoBotonSolicitar: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  navegacionInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  botonNavegacion: {
    padding: 10,
  },
  // Nuevos estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContenido: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '70%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  botonCerrarModal: {
    padding: 5,
  },
  listaPatentes: {
    maxHeight: 400,
  },
  itemPatente: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoPatente: {
    flex: 1,
  },
  textoPatente: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  textoVehiculo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  textoKilometraje: {
    fontSize: 12,
    color: '#999',
  },
});