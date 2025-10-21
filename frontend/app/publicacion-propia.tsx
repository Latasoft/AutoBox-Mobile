import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CustomImagePicker } from '../components/ImagePicker';
import { ThemedView } from '../components/themed-view';

export default function PublicacionPropia() {
  // Estados para los campos del formulario
  const [precio, setPrecio] = useState('');
  const [kilometraje, setKilometraje] = useState('');
  const [region, setRegion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Función para manejar la publicación
  const handlePublicar = () => {
    // Aquí iría la lógica de validación y guardado
    router.push('/detalle-pago');
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.logo}>GoodCars</Text>
      <Text style={styles.subtitle}>INGRESAR INFORMACIÓN DEL AUTO</Text>

      <View style={{flex: 1}}>
        {/* Campos del formulario */}
        <TextInput
          style={styles.input}
          placeholder="PATENTE"
          placeholderTextColor="#9E9E9E"
        />

        <TextInput
          style={styles.input}
          placeholder="PRECIO VENTA"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
          placeholderTextColor="#9E9E9E"
        />

        <TextInput
          style={styles.input}
          placeholder="KILOMETRAJE"
          value={kilometraje}
          onChangeText={setKilometraje}
          keyboardType="numeric"
          placeholderTextColor="#9E9E9E"
        />

        <TextInput
          style={styles.input}
          placeholder="REGIÓN / CIUDAD"
          value={region}
          onChangeText={setRegion}
          placeholderTextColor="#9E9E9E"
        />

        <TextInput
          style={[styles.input, styles.observacionesInput]}
          placeholder="OBSERVACIONES"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          placeholderTextColor="#9E9E9E"
        />

        {/* Sección de video y fotos */}
        <View style={styles.videoSection}>
          <Pressable style={styles.videoButton}>
            <Text>GRABAR VIDEO</Text>
            <Text style={{fontSize: 12, color: '#9E9E9E'}}>(max 60 seg)</Text>
          </Pressable>
          <CustomImagePicker onImageSelected={(uri) => console.log('Imagen seleccionada:', uri)} />
        </View>

        {/* Botón de publicar */}
        <Pressable style={styles.publishButton} onPress={handlePublicar}>
          <Text style={styles.publishButtonText}>PUBLICAR</Text>
        </Pressable>
      </View>

      {/* Botones de navegación */}
      <View style={styles.navigationButtons}>
        <Link href="/vender-auto" asChild>
          <Pressable style={styles.navButton}>
            <Text style={{color: '#FFFFFF'}}>←</Text>
          </Pressable>
        </Link>
        <Link href="/home" asChild>
          <Pressable style={styles.navButton}>
            <Text style={{color: '#FFFFFF'}}>⌂</Text>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    color: '#4A4A4A',
  },
  observacionesInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  videoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 10,
  },
  videoButton: {
    flex: 1,
    height: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  publishButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtons: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    left: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});