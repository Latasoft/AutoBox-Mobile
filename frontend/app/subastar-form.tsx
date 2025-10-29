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

export default function SubastarForm() {
  const router = useRouter();
  
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Datos del vehículo
    marca: '',
    modelo: '',
    año: '',
    kilometraje: '',
    precioBase: '',
    descripcion: '',
    
    // Paso 2: Configuración de subasta
    duracionSubasta: '3', // días
    precioReserva: '',
    incrementoMinimo: '50000',
    
    // Paso 3: Documentación
    permisoCirculacion: false,
    revisionTecnica: false,
    seguroVigente: false,
    notasFinales: '',
  });

  const handleContinuar = () => {
    if (paso === 1) {
      if (!formData.marca || !formData.modelo || !formData.año || !formData.kilometraje || !formData.precioBase) {
        Alert.alert('Error', 'Por favor completa todos los campos del vehículo');
        return;
      }
      setPaso(2);
    } else if (paso === 2) {
      if (!formData.precioReserva || parseInt(formData.precioReserva) < parseInt(formData.precioBase)) {
        Alert.alert('Error', 'El precio de reserva debe ser mayor o igual al precio base');
        return;
      }
      setPaso(3);
    } else if (paso === 3) {
      handleFinalizar();
    }
  };

  const handleFinalizar = () => {
    const comision = parseInt(formData.precioReserva) * 0.05;
    Alert.alert(
      'Subasta Creada',
      `Tu subasta ha sido creada exitosamente.\n\nDuración: ${formData.duracionSubasta} días\nPrecio base: $${parseInt(formData.precioBase).toLocaleString()}\nComisión (5%): $${comision.toLocaleString()}\n\nLos compradores podrán pujar desde ahora.`,
      [
        {
          text: 'Ver mis subastas',
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
          <Text style={estilos.titulo}>Subastar Mi Auto</Text>
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
            <Text style={estilos.labelPaso}>Subasta</Text>
          </View>
          
          <View style={[estilos.lineaPaso, paso >= 3 && estilos.lineaActiva]} />
          
          <View style={estilos.pasoItem}>
            <View style={[estilos.circuloPaso, paso >= 3 && estilos.pasoActivo]}>
              <Text style={[estilos.textoPaso, paso >= 3 && estilos.textoActivo]}>3</Text>
            </View>
            <Text style={estilos.labelPaso}>Documentos</Text>
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
                <Text style={estilos.label}>Precio Base (CLP) *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Precio mínimo de inicio"
                  keyboardType="numeric"
                  value={formData.precioBase}
                  onChangeText={(text) => setFormData({...formData, precioBase: text})}
                />
                <Text style={estilos.ayuda}>Este es el precio desde el cual comenzará la puja</Text>
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Descripción (Opcional)</Text>
                <TextInput
                  style={[estilos.input, estilos.textArea]}
                  placeholder="Describe las características, estado y extras de tu vehículo..."
                  multiline
                  numberOfLines={4}
                  value={formData.descripcion}
                  onChangeText={(text) => setFormData({...formData, descripcion: text})}
                />
              </View>
            </>
          )}

          {paso === 2 && (
            <>
              <Text style={estilos.tituloSeccion}>Configuración de Subasta</Text>
              
              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Duración de la Subasta *</Text>
                <View style={estilos.duracionContainer}>
                  {['3', '5', '7'].map((dias) => (
                    <TouchableOpacity
                      key={dias}
                      style={[
                        estilos.botonDuracion,
                        formData.duracionSubasta === dias && estilos.duracionSeleccionada
                      ]}
                      onPress={() => setFormData({...formData, duracionSubasta: dias})}
                    >
                      <Text style={[
                        estilos.textoDuracion,
                        formData.duracionSubasta === dias && estilos.textoDuracionSeleccionada
                      ]}>
                        {dias} días
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Precio de Reserva (CLP) *</Text>
                <TextInput
                  style={estilos.input}
                  placeholder="Precio mínimo de venta"
                  keyboardType="numeric"
                  value={formData.precioReserva}
                  onChangeText={(text) => setFormData({...formData, precioReserva: text})}
                />
                <Text style={estilos.ayuda}>
                  Si la puja no alcanza este precio, no estás obligado a vender
                </Text>
              </View>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Incremento Mínimo (CLP) *</Text>
                <View style={estilos.incrementoContainer}>
                  {['50000', '100000', '200000', '500000'].map((incremento) => (
                    <TouchableOpacity
                      key={incremento}
                      style={[
                        estilos.botonIncremento,
                        formData.incrementoMinimo === incremento && estilos.incrementoSeleccionado
                      ]}
                      onPress={() => setFormData({...formData, incrementoMinimo: incremento})}
                    >
                      <Text style={[
                        estilos.textoIncremento,
                        formData.incrementoMinimo === incremento && estilos.textoIncrementoSeleccionado
                      ]}>
                        ${parseInt(incremento).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={estilos.ayuda}>Monto mínimo para cada nueva puja</Text>
              </View>

              {/* Simulador de comisión */}
              <View style={estilos.comisionContainer}>
                <Text style={estilos.tituloComision}>Comisión estimada</Text>
                {formData.precioReserva && (
                  <>
                    <Text style={estilos.precioReserva}>
                      ${parseInt(formData.precioReserva).toLocaleString()}
                    </Text>
                    <Text style={estilos.porcentajeComision}>× 5% =</Text>
                    <Text style={estilos.montoComision}>
                      ${(parseInt(formData.precioReserva) * 0.05).toLocaleString()}
                    </Text>
                    <Text style={estilos.textoComision}>
                      Solo pagas si vendes tu vehículo
                    </Text>
                  </>
                )}
              </View>
            </>
          )}

          {paso === 3 && (
            <>
              <Text style={estilos.tituloSeccion}>Documentación del Vehículo</Text>
              
              <Text style={estilos.subtitulo}>Confirma que tienes los siguientes documentos:</Text>

              <TouchableOpacity 
                style={estilos.checkboxContainer}
                onPress={() => setFormData({...formData, permisoCirculacion: !formData.permisoCirculacion})}
              >
                <View style={[estilos.checkbox, formData.permisoCirculacion && estilos.checkboxMarcado]}>
                  {formData.permisoCirculacion && <Ionicons name="checkmark" size={20} color="#fff" />}
                </View>
                <View style={estilos.checkboxTexto}>
                  <Text style={estilos.checkboxTitulo}>Permiso de Circulación</Text>
                  <Text style={estilos.checkboxDescripcion}>Vigente 2025</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={estilos.checkboxContainer}
                onPress={() => setFormData({...formData, revisionTecnica: !formData.revisionTecnica})}
              >
                <View style={[estilos.checkbox, formData.revisionTecnica && estilos.checkboxMarcado]}>
                  {formData.revisionTecnica && <Ionicons name="checkmark" size={20} color="#fff" />}
                </View>
                <View style={estilos.checkboxTexto}>
                  <Text style={estilos.checkboxTitulo}>Revisión Técnica</Text>
                  <Text style={estilos.checkboxDescripcion}>Aprobada y al día</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={estilos.checkboxContainer}
                onPress={() => setFormData({...formData, seguroVigente: !formData.seguroVigente})}
              >
                <View style={[estilos.checkbox, formData.seguroVigente && estilos.checkboxMarcado]}>
                  {formData.seguroVigente && <Ionicons name="checkmark" size={20} color="#fff" />}
                </View>
                <View style={estilos.checkboxTexto}>
                  <Text style={estilos.checkboxTitulo}>Seguro Obligatorio (SOAP)</Text>
                  <Text style={estilos.checkboxDescripcion}>Vigente y pagado</Text>
                </View>
              </TouchableOpacity>

              <View style={estilos.campoContainer}>
                <Text style={estilos.label}>Notas Finales (Opcional)</Text>
                <TextInput
                  style={[estilos.input, estilos.textArea]}
                  placeholder="Información adicional sobre el estado del vehículo, historial de mantenciones, etc."
                  multiline
                  numberOfLines={4}
                  value={formData.notasFinales}
                  onChangeText={(text) => setFormData({...formData, notasFinales: text})}
                />
              </View>

              <View style={estilos.infoFinal}>
                <Ionicons name="information-circle" size={24} color="#2196F3" />
                <Text style={estilos.textoInfoFinal}>
                  Una vez publicada la subasta, comenzará inmediatamente y no podrá ser cancelada.
                </Text>
              </View>
            </>
          )}

          {/* Botón de continuar/finalizar */}
          <TouchableOpacity 
            style={estilos.botonContinuar}
            onPress={handleContinuar}
          >
            <Text style={estilos.textoBotonContinuar}>
              {paso === 3 ? 'Iniciar Subasta' : 'Continuar'}
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
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
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
  ayuda: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  duracionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  botonDuracion: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  duracionSeleccionada: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  textoDuracion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  textoDuracionSeleccionada: {
    color: '#fff',
  },
  incrementoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  botonIncremento: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  incrementoSeleccionado: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  textoIncremento: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  textoIncrementoSeleccionado: {
    color: '#fff',
  },
  comisionContainer: {
    backgroundColor: '#FFF3E0',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  tituloComision: {
    fontSize: 16,
    color: '#E65100',
    fontWeight: '600',
    marginBottom: 12,
  },
  precioReserva: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  porcentajeComision: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  montoComision: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  textoComision: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxMarcado: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxTexto: {
    flex: 1,
  },
  checkboxTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  checkboxDescripcion: {
    fontSize: 13,
    color: '#666',
  },
  infoFinal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  textoInfoFinal: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    marginLeft: 12,
    lineHeight: 20,
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
