import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { 
  validatePatente, 
  validatePrecio, 
  validateKilometraje,
  formatPrecio,
  formatKilometraje 
} from '../utils/validations';

interface Region {
  id: number;
  name: string;
  code: string;
}

interface City {
  id: number;
  region_id: number;
  name: string;
  code: string;
}

export default function VenderAutoFormScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Estados del formulario
  const [formData, setFormData] = useState({
    price: '',
    license_plate: '',
    mileage: '',
    region_id: '',
    city_id: '',
    observations: '',
  });
  
  const [errors, setErrors] = useState({
    price: '',
    license_plate: '',
    mileage: '',
    city_id: '',
  });
  
  const [videoFile, setVideoFile] = useState<any>(null);

  // Cargar regiones y ciudades al montar
  useEffect(() => {
    loadRegionsAndCities();
  }, []);

  // Filtrar ciudades cuando cambia la región
  useEffect(() => {
    if (formData.region_id) {
      const filtered = cities.filter(
        city => city.region_id === parseInt(formData.region_id)
      );
      setFilteredCities(filtered);
      // Resetear ciudad si la región cambia
      if (formData.city_id) {
        const cityExists = filtered.find(c => c.id === parseInt(formData.city_id));
        if (!cityExists) {
          setFormData(prev => ({ ...prev, city_id: '' }));
        }
      }
    } else {
      setFilteredCities([]);
    }
  }, [formData.region_id, cities]);

  const loadRegionsAndCities = async () => {
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
      Alert.alert('Error', 'No se pudieron cargar los datos');
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
    
    // Validar en tiempo real
    if (value) {
      validateField(field, value);
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Verificar tamaño (máximo 60MB)
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
    // Validar todos los campos
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

    setLoading(true);

    try {
      // Crear FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append('price', formData.price);
      formDataToSend.append('license_plate', formData.license_plate.toUpperCase());
      formDataToSend.append('mileage', formData.mileage);
      formDataToSend.append('city_id', formData.city_id);
      formDataToSend.append('observations', formData.observations);
      formDataToSend.append('user_id', '1'); // Por ahora usuario hardcodeado
      
      // Por ahora, para crear un vehículo, necesitamos estos datos adicionales
      // En producción, podrías obtenerlos de una base de datos de vehículos por patente
      formDataToSend.append('brand_id', '1'); // Mazda
      formDataToSend.append('model_id', '1'); // Mazda 2
      formDataToSend.append('year', '2015');
      formDataToSend.append('fuel_type', 'gasoline');
      formDataToSend.append('transmission', 'manual');

      // Agregar video
      formDataToSend.append('video', {
        uri: videoFile.uri,
        type: videoFile.mimeType || 'video/mp4',
        name: videoFile.name,
      } as any);

      const response = await fetch('http://localhost:3000/api/listings', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Éxito',
          'Tu auto ha sido publicado correctamente',
          [
            {
              text: 'OK',
              onPress: () => router.push('/home'),
            },
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'No se pudo publicar el auto');
      }
    } catch (error) {
      console.error('Error al publicar:', error);
      Alert.alert('Error', 'Ocurrió un error al publicar el auto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              Good<Text style={styles.logoGreen}>Cars</Text>
            </Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>INGRESAR INFORMACIÓN</Text>
          <Text style={styles.subtitle}>DEL AUTO</Text>

          {/* Formulario */}
          <View style={styles.form}>
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
                placeholder="BBCD12 o BB1234"
                autoCapitalize="characters"
                maxLength={6}
              />
              {errors.license_plate ? <Text style={styles.errorText}>{errors.license_plate}</Text> : null}
              <Text style={styles.helperText}>4 letras + 2 números o 2 letras + 4 números</Text>
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
              {loadingData ? (
                <ActivityIndicator size="small" color="#7CB342" />
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.region_id}
                    onValueChange={(itemValue: string) =>
                      setFormData({ ...formData, region_id: itemValue, city_id: '' })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecciona una región" value="" />
                    {regions.map((region) => (
                      <Picker.Item
                        key={region.id}
                        label={region.name}
                        value={region.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CIUDAD *</Text>
              {loadingData ? (
                <ActivityIndicator size="small" color="#7CB342" />
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.city_id}
                    onValueChange={(itemValue: string) =>
                      setFormData({ ...formData, city_id: itemValue })
                    }
                    style={styles.picker}
                    enabled={formData.region_id !== ''}
                  >
                    <Picker.Item 
                      label={formData.region_id ? "Selecciona una ciudad" : "Primero selecciona región"} 
                      value="" 
                    />
                    {filteredCities.map((city) => (
                      <Picker.Item
                        key={city.id}
                        label={city.name}
                        value={city.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>
              )}
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

            {/* Botones de video */}
            <View style={styles.videoButtons}>
              <TouchableOpacity
                style={styles.videoButton}
                onPress={handlePickVideo}
              >
                <Ionicons name="cloud-upload-outline" size={30} color="#666" />
                <Text style={styles.videoButtonText}>ADJUNTAR</Text>
                <Text style={styles.videoButtonText}>VIDEO</Text>
                <Text style={styles.videoButtonSubtext}>(máx 60 seg)</Text>
              </TouchableOpacity>

              {videoFile && (
                <View style={styles.videoInfo}>
                  <Ionicons name="checkmark-circle" size={24} color="#7CB342" />
                  <Text style={styles.videoInfoText}>Video seleccionado</Text>
                  <Text style={styles.videoInfoSubtext}>{videoFile.name}</Text>
                </View>
              )}
            </View>

            {/* Botón publicar */}
            <TouchableOpacity
              style={[styles.publishButton, loading && styles.publishButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.publishButtonText}>PUBLICAR</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botones de navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={30} color="#4A90E2" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/home')}
        >
          <Ionicons name="home" size={30} color="#7CB342" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  logoGreen: {
    color: '#7CB342',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  form: {
    gap: 20,
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
    marginTop: 4,
  },
  helperText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
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
  picker: {
    height: 50,
  },
  videoButtons: {
    marginTop: 10,
    gap: 15,
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
    marginTop: 5,
  },
  videoButtonSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  videoInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    gap: 5,
  },
  videoInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7CB342',
  },
  videoInfoSubtext: {
    fontSize: 12,
    color: '#666',
  },
  publishButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  publishButtonDisabled: {
    opacity: 0.6,
  },
  publishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#2C3E50',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  navButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
});
