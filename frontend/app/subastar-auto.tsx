import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { generarRangoAños, marcasAutos } from '../constants/marcas-autos';

interface Autobox {
  id_autobox: number;
  nombre: string;
  direccion: string;
  ciudad: string;
}

interface Horario {
  id_horario: number;
  hora: string;
}

export default function SubastarAuto() {
  const router = useRouter();

  const esDiaLaboral = (fecha: Date): boolean => {
    const dia = fecha.getDay();
    return dia >= 1 && dia <= 5;
  };

  const obtenerProximoDiaLaboral = (): Date => {
    const hoy = new Date();
    let fecha = new Date(hoy);
    if (esDiaLaboral(fecha)) return fecha;
    while (!esDiaLaboral(fecha)) {
      fecha.setDate(fecha.getDate() + 1);
    }
    return fecha;
  };

  const obtenerFechaMaxima = (): Date => {
    const hoy = new Date();
    const fechaMaxima = new Date(hoy);
    fechaMaxima.setDate(hoy.getDate() + 14);
    return fechaMaxima;
  };
  
  const [formData, setFormData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    año: '',
    fecha: '',
    hora: '',
    autobox: '',
    autoboxId: null as number | null,
    rut: '',
    fono: '',
    mail: '',
    precioObjetivo: '',
    aceptaTerminos: false,
  });

  const [autoboxes, setAutoboxes] = useState<Autobox[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [mostrarAutoboxes, setMostrarAutoboxes] = useState(false);
  const [mostrarHorarios, setMostrarHorarios] = useState(false);
  const [mostrarMarcas, setMostrarMarcas] = useState(false);
  const [mostrarAños, setMostrarAños] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerProximoDiaLaboral());

  useEffect(() => {
    cargarAutoboxes();
    cargarHorarios();
  }, []);

  const cargarAutoboxes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/autoboxes');
      const data = await response.json();
      setAutoboxes(data);
    } catch (error) {
      console.error('Error cargando autoboxes:', error);
    }
  };

  const cargarHorarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/horarios');
      const data = await response.json();
      setHorarios(data);
    } catch (error) {
      console.error('Error cargando horarios:', error);
    }
  };

  const seleccionarAutobox = (autobox: Autobox) => {
    setFormData({
      ...formData, 
      autobox: autobox.nombre,
      autoboxId: autobox.id_autobox
    });
    setMostrarAutoboxes(false);
  };

  const seleccionarHorario = (horario: Horario) => {
    setFormData({...formData, hora: horario.hora});
    setMostrarHorarios(false);
  };

  const seleccionarMarca = (marca: string) => {
    setFormData({...formData, marca});
    setMostrarMarcas(false);
  };

  const seleccionarAño = (año: number) => {
    setFormData({...formData, año: año.toString()});
    setMostrarAños(false);
  };

  const onCambiarFecha = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setMostrarCalendario(false);
    }
    if (selectedDate) {
      setFechaSeleccionada(selectedDate);
      const fechaFormateada = selectedDate.toISOString().split('T')[0];
      setFormData({...formData, fecha: fechaFormateada});
      if (Platform.OS === 'ios') {
        setMostrarCalendario(false);
      }
    }
  };
  
  const handleSubastar = () => {
    if (!formData.patente || !formData.marca || !formData.modelo || !formData.año || 
        !formData.fecha || !formData.hora || !formData.autobox || 
        !formData.rut || !formData.fono || !formData.mail || !formData.precioObjetivo) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!formData.aceptaTerminos) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }

    Alert.alert(
      'Subasta Creada',
      'Tu subasta ha sido creada exitosamente.',
      [{ text: 'OK', onPress: () => router.push('/home') }]
    );
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilos.encabezado}>
          <View style={estilos.logoContainer}>
            <Text style={estilos.logo}>
              <Text style={estilos.textoGood}>Good</Text>
              <Text style={estilos.textoCars}>Cars</Text>
            </Text>
            <Text style={estilos.iconos}>🚗🔨</Text>
          </View>
          
          <Text style={estilos.titulo}>SUBASTAR MI AUTO</Text>
          <Text style={estilos.subtitulo}>
            DESCRIPCION DEL MODELO{'\n'}DE SUBASTA
          </Text>
          
          <TouchableOpacity style={estilos.botonPlay}>
            <Ionicons name="play-circle" size={50} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <View style={estilos.formulario}>
          <View style={estilos.fila}>
            <Text style={estilos.label}>PATENTE</Text>
            <TextInput
              style={estilos.input}
              value={formData.patente}
              onChangeText={(text) => setFormData({...formData, patente: text.toUpperCase()})}
              placeholder=""
              autoCapitalize="characters"
              maxLength={6}
            />
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>MARCA</Text>
            <TouchableOpacity 
              style={estilos.selector}
              onPress={() => setMostrarMarcas(true)}
            >
              <Text style={estilos.textoSelector}>
                {formData.marca || 'SELECCIONAR'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>MODELO</Text>
            <TextInput
              style={estilos.input}
              value={formData.modelo}
              onChangeText={(text) => setFormData({...formData, modelo: text})}
              placeholder="Ej: Corolla, Spark, Versa"
            />
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>AÑO</Text>
            <TouchableOpacity 
              style={estilos.selector}
              onPress={() => setMostrarAños(true)}
            >
              <Text style={estilos.textoSelector}>
                {formData.año || 'SELECCIONAR'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.filaDoble}>
            <View style={estilos.campoMitad}>
              <Text style={estilos.label}>FECHA</Text>
              <TouchableOpacity 
                style={estilos.selector}
                onPress={() => setMostrarCalendario(true)}
              >
                <Text style={estilos.textoSelector}>
                  {formData.fecha || 'SELECCIONAR'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={estilos.campoMitad}>
              <Text style={estilos.label}>HORA</Text>
              <TouchableOpacity 
                style={estilos.selector}
                onPress={() => setMostrarHorarios(true)}
              >
                <Text style={estilos.textoSelector}>
                  {formData.hora || 'SELECCIONAR'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>AUTOBOX</Text>
            <TouchableOpacity 
              style={estilos.selectorAutobox}
              onPress={() => setMostrarAutoboxes(true)}
            >
              <Text style={estilos.textoSelector}>
                {formData.autobox || 'SELECCIONAR'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>RUT</Text>
            <TextInput
              style={estilos.input}
              value={formData.rut}
              onChangeText={(text) => setFormData({...formData, rut: text})}
              placeholder=""
              keyboardType="numeric"
            />
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>FONO</Text>
            <TextInput
              style={estilos.input}
              value={formData.fono}
              onChangeText={(text) => setFormData({...formData, fono: text})}
              placeholder=""
              keyboardType="phone-pad"
            />
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>MAIL</Text>
            <TextInput
              style={estilos.input}
              value={formData.mail}
              onChangeText={(text) => setFormData({...formData, mail: text})}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={estilos.fila}>
            <Text style={estilos.label}>PRECIO OBJETIVO</Text>
            <TextInput
              style={estilos.input}
              value={formData.precioObjetivo}
              onChangeText={(text) => setFormData({...formData, precioObjetivo: text})}
              placeholder="$7.000.000"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity 
            style={estilos.terminosContainer}
            onPress={() => setFormData({...formData, aceptaTerminos: !formData.aceptaTerminos})}
          >
            <View style={[estilos.checkbox, formData.aceptaTerminos && estilos.checkboxMarcado]}>
              {formData.aceptaTerminos && <Ionicons name="checkmark" size={16} color="#4CAF50" />}
            </View>
            <Text style={estilos.textoTerminos}>Acepto términos y condiciones</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={estilos.botonSubastar}
            onPress={handleSubastar}
          >
            <Text style={estilos.textoBoton}>SUBASTAR</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.navegacionInferior}>
          <TouchableOpacity 
            style={estilos.botonNavegacion}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-circle" size={60} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={estilos.botonNavegacion}
            onPress={() => router.push('/home')}
          >
            <Ionicons name="home" size={60} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Modal Autoboxes */}
        <Modal
          visible={mostrarAutoboxes}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setMostrarAutoboxes(false)}
        >
          <View style={estilos.modalContainer}>
            <View style={estilos.modalContent}>
              <Text style={estilos.modalTitulo}>Seleccionar AutoBox</Text>
              <ScrollView style={estilos.modalScroll}>
                {autoboxes.map((autobox) => (
                  <TouchableOpacity
                    key={autobox.id_autobox}
                    style={estilos.modalItem}
                    onPress={() => seleccionarAutobox(autobox)}
                  >
                    <Text style={estilos.modalItemTexto}>{autobox.nombre}</Text>
                    <Text style={estilos.modalItemSubtexto}>
                      {autobox.direccion}, {autobox.ciudad}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={estilos.modalBotonCerrar}
                onPress={() => setMostrarAutoboxes(false)}
              >
                <Text style={estilos.modalBotonTexto}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Horarios */}
        <Modal
          visible={mostrarHorarios}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setMostrarHorarios(false)}
        >
          <View style={estilos.modalContainer}>
            <View style={estilos.modalContent}>
              <Text style={estilos.modalTitulo}>Seleccionar Horario</Text>
              <ScrollView style={estilos.modalScroll}>
                {horarios.map((horario) => (
                  <TouchableOpacity
                    key={horario.id_horario}
                    style={estilos.modalItem}
                    onPress={() => seleccionarHorario(horario)}
                  >
                    <Text style={estilos.modalItemTexto}>{horario.hora}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={estilos.modalBotonCerrar}
                onPress={() => setMostrarHorarios(false)}
              >
                <Text style={estilos.modalBotonTexto}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={mostrarMarcas} transparent={true} animationType="slide" onRequestClose={() => setMostrarMarcas(false)}>
          <View style={estilos.modalContainer}>
            <View style={estilos.modalContent}>
              <Text style={estilos.modalTitulo}>Seleccionar Marca</Text>
              <ScrollView style={estilos.modalScroll}>
                {marcasAutos.map((marca, index) => (
                  <TouchableOpacity key={index} style={estilos.modalItem} onPress={() => seleccionarMarca(marca)}>
                    <Text style={estilos.modalItemTexto}>{marca}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={estilos.modalBotonCerrar} onPress={() => setMostrarMarcas(false)}>
                <Text style={estilos.modalBotonTexto}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={mostrarAños} transparent={true} animationType="slide" onRequestClose={() => setMostrarAños(false)}>
          <View style={estilos.modalContainer}>
            <View style={estilos.modalContent}>
              <Text style={estilos.modalTitulo}>Seleccionar Año</Text>
              <ScrollView style={estilos.modalScroll}>
                {generarRangoAños().map((año, index) => (
                  <TouchableOpacity key={index} style={estilos.modalItem} onPress={() => seleccionarAño(año)}>
                    <Text style={estilos.modalItemTexto}>{año}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={estilos.modalBotonCerrar} onPress={() => setMostrarAños(false)}>
                <Text style={estilos.modalBotonTexto}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {mostrarCalendario && (
          <DateTimePicker
            value={fechaSeleccionada}
            mode="date"
            display="default"
            onChange={onCambiarFecha}
            minimumDate={obtenerProximoDiaLaboral()}
            maximumDate={obtenerFechaMaxima()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
  },
  encabezado: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    marginRight: 10,
  },
  textoGood: {
    color: '#333',
  },
  textoCars: {
    color: '#4CAF50',
  },
  iconos: {
    fontSize: 30,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  botonPlay: {
    marginBottom: 10,
  },
  formulario: {
    padding: 20,
    backgroundColor: '#fff',
  },
  fila: {
    marginBottom: 15,
  },
  filaDoble: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  campoMitad: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  selectorAutobox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoSelector: {
    fontSize: 14,
    color: '#999',
  },
  terminosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxMarcado: {
    backgroundColor: '#fff',
  },
  textoTerminos: {
    fontSize: 14,
    color: '#4CAF50',
  },
  botonSubastar: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  navegacionInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#2C3E50',
  },
  botonNavegacion: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemTexto: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalItemSubtexto: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalBotonCerrar: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  modalBotonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
