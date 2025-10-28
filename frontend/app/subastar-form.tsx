import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

export default function SubastarFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const auctionType = params.type as string || 'standard';
  
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    price: '',
    reserve_price: '',
    license_plate: '',
    mileage: '',
    region_id: '',
    city_id: '',
    observations: '',
    duration_days: '7',
    bid_increment: '100000',
  });
  
  const [errors, setErrors] = useState({
    price: '',
    reserve_price: '',
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
      case 'reserve_price':
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

  const handleSubmit = async () => {
    // Validaciones
    const isPriceValid = validateField('price', formData.price);
    const isPatenteValid = validateField('license_plate', formData.license_plate);
    const isKmValid = validateField('mileage', formData.mileage);
    
    if (!formData.price || !formData.license_plate || !formData.mileage || !formData.city_id) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (auctionType === 'reserve' && !formData.reserve_price) {
      Alert.alert('Error', 'El precio de reserva es obligatorio para este tipo de subasta');
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

    setLoading(true);

    try {
      // TODO: Implementar lógica de creación de subasta
      Alert.alert(
        'Subasta Creada',
        'Tu subasta ha sido publicada exitosamente',
        [{ text: 'OK', onPress: () => router.push('/home') }]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un error al crear la subasta');
    } finally {
      setLoading(false);
    }
  };

  const getAuctionTypeTitle = () => {
    switch (auctionType) {
      case 'reserve':
        return 'Subasta con Reserva';
      case 'dutch':
        return 'Subasta Holandesa';
      default:
        return 'Subasta Estándar';
    }
  };

  return (
    <VehicleFormLayout
      title="SUBASTAR MI AUTO"
      subtitle={getAuctionTypeTitle()}
    >
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PRECIO BASE DE SUBASTA *</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text.replace(/[^0-9]/g, ''))}
            placeholder="Ej: 5000000"
            keyboardType="numeric"
          />
          {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
          <Text style={styles.helperText}>Precio inicial desde donde comienza la subasta</Text>
        </View>

        {auctionType === 'reserve' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRECIO DE RESERVA *</Text>
            <TextInput
              style={[styles.input, errors.reserve_price && styles.inputError]}
              value={formData.reserve_price}
              onChangeText={(text) => handleInputChange('reserve_price', text.replace(/[^0-9]/g, ''))}
              placeholder="Ej: 6000000"
              keyboardType="numeric"
            />
            {errors.reserve_price ? <Text style={styles.errorText}>{errors.reserve_price}</Text> : null}
            <Text style={styles.helperText}>Precio mínimo al que estás dispuesto a vender</Text>
          </View>
        )}

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
          <Text style={styles.label}>DURACIÓN DE LA SUBASTA *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.duration_days}
              onValueChange={(value: string) => setFormData({ ...formData, duration_days: value })}
            >
              <Picker.Item label="3 días" value="3" />
              <Picker.Item label="5 días" value="5" />
              <Picker.Item label="7 días" value="7" />
              <Picker.Item label="10 días" value="10" />
              <Picker.Item label="14 días" value="14" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>INCREMENTO MÍNIMO DE OFERTA *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.bid_increment}
              onValueChange={(value: string) => setFormData({ ...formData, bid_increment: value })}
            >
              <Picker.Item label="$50.000" value="50000" />
              <Picker.Item label="$100.000" value="100000" />
              <Picker.Item label="$200.000" value="200000" />
              <Picker.Item label="$500.000" value="500000" />
            </Picker>
          </View>
          <Text style={styles.helperText}>Monto mínimo que debe aumentar cada oferta</Text>
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
          <Text style={styles.videoButtonSubtext}>(máx 60 seg)</Text>
        </TouchableOpacity>

        {videoFile && (
          <View style={styles.videoInfo}>
            <Ionicons name="checkmark-circle" size={24} color="#7CB342" />
            <Text style={styles.videoInfoText}>Video seleccionado: {videoFile.name}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="hammer" size={24} color="#FFF" />
              <Text style={styles.submitButtonText}>PUBLICAR SUBASTA</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </VehicleFormLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
    paddingBottom: 40,
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
  helperText: {
    color: '#999',
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
  videoButtonSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
