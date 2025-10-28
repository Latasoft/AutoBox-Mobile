import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import VehicleFormLayout from '../components/VehicleFormLayout';
import { 
  validatePatente, 
  validatePrecio, 
  validateKilometraje 
} from '../utils/validations';

interface Region {
  id: number;
  name: string;
}

interface City {
  id: number;
  region_id: number;
  name: string;
}

interface AutoBox {
  id: number;
  name: string;
  address: string;
  city_id: number;
}

export default function PublicacionRevisionFormScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Datos de formulario
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [autoboxes, setAutoboxes] = useState<AutoBox[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    price: '',
    license_plate: '',
    mileage: '',
    region_id: '',
    city_id: '',
    observations: '',
    autobox_id: '',
    inspection_date: '',
    inspection_time: '',
  });
  
  const [errors, setErrors] = useState({
    price: '',
    license_plate: '',
    mileage: '',
  });
  
  const [videoFile, setVideoFile] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.region_id) {
      const filtered = cities.filter(
        city => city.region_id === parseInt(formData.region_id)
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formData.region_id, cities]);

  const loadData = async () => {
    try {
      const [regionsRes, citiesRes] = await Promise.all([
        fetch('http://localhost:3000/api/regions'),
        fetch('http://localhost:3000/api/cities')
      ]);
      
      const regionsData = await regionsRes.json();
      const citiesData = await citiesRes.json();
      
      if (regionsData.success) setRegions(regionsData.data);
      if (citiesData.success) setCities(citiesData.data);
      
      // TODO: Cargar autoboxes desde la API
      setAutoboxes([
        { id: 1, name: 'AutoBox Ñuñoa', address: 'Av. Grecia 9832', city_id: 1 },
        { id: 2, name: 'AutoBox Las Condes', address: 'Av. Apoquindo 4501', city_id: 1 },
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'price':
        const priceResult = validatePrecio(value);
        error = priceResult.isValid ? '' : priceResult.message || '';
        break;
      case 'license_plate':
        const patenteResult = validatePatente(value);
        error = patenteResult.isValid ? '' : patenteResult.message || '';
        break;
      case 'mileage':
        const kmResult = validateKilometraje(value);
        error = kmResult.isValid ? '' : kmResult.message || '';
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (value) validateField(field, value);
  };

  const handlePickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        if (file.size && file.size > 60 * 1024 * 1024) {
          Alert.alert('Error', 'El video no debe superar los 60MB');
          return;
        }

        setVideoFile(file);
        Alert.alert('Éxito', 'Video seleccionado correctamente');
      }
    } catch (error) {
      console.error('Error al seleccionar video:', error);
      Alert.alert('Error', 'No se pudo seleccionar el video');
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validar datos del vehículo
      const isPriceValid = validateField('price', formData.price);
      const isPatenteValid = validateField('license_plate', formData.license_plate);
      const isKmValid = validateField('mileage', formData.mileage);
      
      if (!formData.price || !formData.license_plate || !formData.mileage || !formData.city_id) {
        Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
        return;
      }

      if (!isPriceValid || !isPatenteValid || !isKmValid) {
        Alert.alert('Error', 'Por favor corrige los errores en el formulario');
        return;
      }

      if (!videoFile) {
        Alert.alert('Error', 'Por favor adjunta un video del vehículo');
        return;
      }

      setCurrentStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!formData.autobox_id || !formData.inspection_date || !formData.inspection_time) {
      Alert.alert('Error', 'Por favor completa los datos de la inspección');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implementar lógica de creación con inspección
      Alert.alert(
        'Solicitud Enviada',
        'Tu solicitud de inspección ha sido recibida. Te contactaremos pronto.',
        [{ text: 'OK', onPress: () => router.push('/home') }]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.form}>
      <Text style={styles.stepTitle}>Paso 1: Datos del Vehículo</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>PRECIO VENTA *</Text>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          value={formData.price}
          onChangeText={(text) => handleInputChange('price', text.replace(/[^0-9]/g, ''))}
          placeholder="Ej: 5500000"
          keyboardType="numeric"
        />
        {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PATENTE *</Text>
        <TextInput
          style={[styles.input, errors.license_plate && styles.inputError]}
          value={formData.license_plate}
          onChangeText={(text) => handleInputChange('license_plate', text.toUpperCase())}
          placeholder="BBCD12"
          autoCapitalize="characters"
          maxLength={6}
        />
        {errors.license_plate ? <Text style={styles.errorText}>{errors.license_plate}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>KILOMETRAJE *</Text>
        <TextInput
          style={[styles.input, errors.mileage && styles.inputError]}
          value={formData.mileage}
          onChangeText={(text) => handleInputChange('mileage', text.replace(/[^0-9]/g, ''))}
          placeholder="Ej: 85000"
          keyboardType="numeric"
        />
        {errors.mileage ? <Text style={styles.errorText}>{errors.mileage}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>REGIÓN *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.region_id}
            onValueChange={(value: string) => setFormData({ ...formData, region_id: value, city_id: '' })}
          >
            <Picker.Item label="Selecciona región" value="" />
            {regions.map(r => (
              <Picker.Item key={r.id} label={r.name} value={r.id.toString()} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CIUDAD *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.city_id}
            onValueChange={(value: string) => setFormData({ ...formData, city_id: value })}
            enabled={formData.region_id !== ''}
          >
            <Picker.Item label={formData.region_id ? "Selecciona ciudad" : "Primero selecciona región"} value="" />
            {filteredCities.map(c => (
              <Picker.Item key={c.id} label={c.name} value={c.id.toString()} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>OBSERVACIONES</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.observations}
          onChangeText={(text) => setFormData({ ...formData, observations: text })}
          placeholder="Describe tu vehículo..."
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.videoButton} onPress={handlePickVideo}>
        <Ionicons name="cloud-upload-outline" size={30} color="#666" />
        <Text style={styles.videoButtonText}>ADJUNTAR VIDEO</Text>
      </TouchableOpacity>

      {videoFile && (
        <View style={styles.videoInfo}>
          <Ionicons name="checkmark-circle" size={24} color="#7CB342" />
          <Text style={styles.videoInfoText}>Video seleccionado</Text>
        </View>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>SIGUIENTE</Text>
        <Ionicons name="arrow-forward" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.form}>
      <Text style={styles.stepTitle}>Paso 2: Agendar Inspección</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>AUTOBOX *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.autobox_id}
            onValueChange={(value: string) => setFormData({ ...formData, autobox_id: value })}
          >
            <Picker.Item label="Selecciona un AutoBox" value="" />
            {autoboxes.map(ab => (
              <Picker.Item 
                key={ab.id} 
                label={`${ab.name} - ${ab.address}`} 
                value={ab.id.toString()} 
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>FECHA *</Text>
        <TextInput
          style={styles.input}
          value={formData.inspection_date}
          onChangeText={(text) => setFormData({ ...formData, inspection_date: text })}
          placeholder="DD/MM/AAAA"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>HORA *</Text>
        <TextInput
          style={styles.input}
          value={formData.inspection_time}
          onChangeText={(text) => setFormData({ ...formData, inspection_time: text })}
          placeholder="HH:MM"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setCurrentStep(1)}
        >
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>ATRÁS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>ENVIAR SOLICITUD</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <VehicleFormLayout
      title="PUBLICACIÓN CON"
      subtitle="REVISIÓN MECÁNICA"
    >
      {currentStep === 1 ? renderStep1() : renderStep2()}
    </VehicleFormLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  inputError: {
    borderColor: '#FF5252',
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  videoButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
  },
  videoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  videoInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  videoInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7CB342',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#7CB342',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
