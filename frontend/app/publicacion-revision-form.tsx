import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PublicacionRevisionForm() {
  const router = useRouter();
  
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Datos del vehículo
    marca: '',
    modelo: '',
    año: '',
    kilometraje: '',
    precio: '',
    
    // Paso 2: Datos del propietario
    nombrePropietario: '',
    telefonoPropietario: '',
    emailPropietario: '',
    direccion: '',
    
    // Paso 3: Solicitar revisión mecánica
    fechaPreferida: '',
    horaPreferida: '',
    notasAdicionales: '',
  });

  const handleContinuar = () => {
    if (paso === 1) {
      if (!formData.marca || !formData.modelo || !formData.año || !formData.kilometraje || !formData.precio) {
        Alert.alert('Error', 'Por favor completa todos los campos del vehículo');
        return;
      }
      setPaso(2);
    } else if (paso === 2) {
      if (!formData.nombrePropietario || !formData.telefonoPropietario || !formData.emailPropietario) {
        Alert.alert('Error', 'Por favor completa todos tus datos de contacto');
        return;
      }
      setPaso(3);
    } else if (paso === 3) {
      if (!formData.fechaPreferida || !formData.horaPreferida) {
        Alert.alert('Error', 'Por favor selecciona fecha y hora para la revisión');
        return;
      }
      handleFinalizar();
    }
  };

  const handleFinalizar = () => {
    Alert.alert(
      'Solicitud Enviada',
      'Tu solicitud de publicación con revisión mecánica ha sido enviada. Un mecánico se contactará contigo pronto.',
      [
        {
          text: 'Ver mis solicitudes',
          onPress: () => router.push('/home'),
        },
      ]
    );
  };

  const handleRetroceder = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={estilos.encabezado}>
          <TouchableOpacity 
            style={estilos.botonRegresar} 
            onPress={handleRetroceder}
          >
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={estilos.titulo}>Publicación con Revisión</Text>
          <View style={estilos.espacioVacio} />
        </View>

        {/* Indicador de pasos */}
        <View style={estilos.indicadorPasos}>
          <View style={estilos.pasoItem}>
            <View style={[estilos.circuloPaso, paso >= 1 && estilos.pasoActivo]}>
              <Text style={[estilos.textoPaso, paso >= 1 && estilos.textoActivo]}>1</Text>
            </View>
            <Text style={estilos.labelPaso}>Vehículo</Text>
          </View>
          
          <View style={[estilos.lineaPaso, paso >= 2 && estilos.lineaActiva]} />
          
          <View style={estilos.pasoItem}>
            <View style={[estilos.circuloPaso, paso >= 2 && estilos.pasoActivo]}>
              <Text style={[estilos.textoPaso, paso >= 2 && estilos.textoActivo]}>2</Text>
            </View>
            <Text style={estilos.labelPaso}>Contacto</Text>
          </View>
          
          <View style={[estilos.lineaPaso, paso >= 3 && estilos.lineaActiva]} />
          
          <View style={estilos.pasoItem}>
            <View style={[estilos.circuloPaso, paso >= 3 && estilos.pasoActivo]}>
              <Text style={[estilos.textoPaso, paso >= 3 && estilos.textoActivo]}>3</Text>
            </View>
            <Text style={estilos.labelPaso}>Revisión</Text>
          </View>
        </View>

        {/* Formulario según el paso */}
        <View style={estilos.formulario}>
          {paso === 1 && (
            <>
              <Text style={estilos.tituloSeccion}>Datos del Vehículo</Text>
              
              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Marca *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Ej: Toyota, Chevrolet, Hyundai"
                  value={formData.marca}
                  onChangeText={(text) => setFormData({...formData, marca: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Modelo *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Ej: Corolla, Cruze, Elantra"
                  value={formData.modelo}
                  onChangeText={(text) => setFormData({...formData, modelo: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Año *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Ej: 2020"
                  keyboardType="numeric"
                  value={formData.año}
                  onChangeText={(text) => setFormData({...formData, año: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Kilometraje (km) *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Ej: 50000"
                  keyboardType="numeric"
                  value={formData.kilometraje}
                  onChangeText={(text) => setFormData({...formData, kilometraje: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Precio Estimado (CLP) *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Ej: 8000000"
                  keyboardType="numeric"
                  value={formData.precio}
                  onChangeText={(text) => setFormData({...formData, precio: text})}
                />
              </View>
            </>
          )}

          {paso === 2 && (
            <>
              <Text style={estilos.tituloSeccion}>Tus Datos de Contacto</Text>
              
              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Nombre Completo *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Tu nombre completo"
                  value={formData.nombrePropietario}
                  onChangeText={(text) => setFormData({...formData, nombrePropietario: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Teléfono *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="+56 9 1234 5678"
                  keyboardType="phone-pad"
                  value={formData.telefonoPropietario}
                  onChangeText={(text) => setFormData({...formData, telefonoPropietario: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Email *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.emailPropietario}
                  onChangeText={(text) => setFormData({...formData, emailPropietario: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Dirección (Opcional)</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Calle, número, comuna"
                  value={formData.direccion}
                  onChangeText={(text) => setFormData({...formData, direccion: text})}
                />
              </View>
            </>
          )}

          {paso === 3 && (
            <>
              <Text style={estilos.tituloSeccion}>Agendar Revisión Mecánica</Text>
              
              <View style={estilos.infoRevision}>
                <Ionicons name="construct" size={40} color="#4CAF50" />
                <Text style={estilos.textoInfoRevision}>
                  Un mecánico certificado visitará tu ubicación para revisar el vehículo
                </Text>
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Fecha Preferida *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="DD/MM/AAAA"
                  value={formData.fechaPreferida}
                  onChangeText={(text) => setFormData({...formData, fechaPreferida: text})}
                />
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Hora Preferida *</Text>
                <View style={estilos.horasContainer}>
                  {['09:00', '11:00', '14:00', '16:00', '18:00'].map((hora) => (
                    <TouchableOpacity
                      key={hora}
                      style={[
                        estilos.botonHora,
                        formData.horaPreferida === hora && estilos.horaSeleccionada
                      ]}
                      onPress={() => setFormData({...formData, horaPreferida: hora})}
                    >
                      <Text style={[
                        estilos.textoHora,
                        formData.horaPreferida === hora && estilos.textoHoraSeleccionada
                      ]}>
                        {hora}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Notas Adicionales (Opcional)</Text>
                <TextInput
                  style={[estilos.input, estilos.textArea]}
                  placeholder="Información adicional sobre tu vehículo o preferencias de horario..."
                  multiline
                  numberOfLines={4}
                  value={formData.notasAdicionales}
                  onChangeText={(text) => setFormData({...formData, notasAdicionales: text})}
                />
              </View>

              <View style={estilos.costoContainer}>
                <Text style={estilos.textoCosto}>Costo del servicio:</Text>
                <Text style={estilos.costo}>$50.000 CLP</Text>
                <Text style={estilos.textoIncluye}>Incluye revisión + publicación premium</Text>
              </View>
            </>
          )}

          {/* Botón de continuar/finalizar */}
          <TouchableOpacity 
            style={estilos.botonContinuar}
            onPress={handleContinuar}
          >
            <Text style={estilos.textoBotonContinuar}>
              {paso === 3 ? 'Solicitar Revisión' : 'Continuar'}
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Navegación inferior */}
        <View style={estilos.navegacionInferior}>
          <TouchableOpacity 
            style={estilos.botonNavegacion}
            onPress={handleRetroceder}
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  espacioVacio: {
    width: 40,
  },
  indicadorPasos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  pasoItem: {
    alignItems: 'center',
  },
  circuloPaso: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pasoActivo: {
    backgroundColor: '#4CAF50',
  },
  textoPaso: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  textoActivo: {
    color: '#fff',
  },
  labelPaso: {
    fontSize: 12,
    color: '#666',
  },
  lineaPaso: {
    width: 50,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  lineaActiva: {
    backgroundColor: '#4CAF50',
  },
  formulario: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  tituloSeccion: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  campoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoRevision: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  textoInfoRevision: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    lineHeight: 20,
  },
  horasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  botonHora: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  horaSeleccionada: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  textoHora: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  textoHoraSeleccionada: {
    color: '#fff',
  },
  costoContainer: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoCosto: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  costo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  textoIncluye: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  botonContinuar: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 12,
  },
  textoBotonContinuar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navegacionInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    backgroundColor: 'rgba(0,0,0,0.8)',
    marginTop: 24,
  },
  botonNavegacion: {
    padding: 10,
  },
});
