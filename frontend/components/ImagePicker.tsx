import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
}

export const CustomImagePicker: React.FC<ImagePickerProps> = ({ onImageSelected }) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para acceder a la galería');
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      alert('Error al seleccionar la imagen');
    }
  };

  return (
    <Pressable style={styles.button} onPress={pickImage}>
      <Text style={styles.buttonText}>ADJUNTAR</Text>
      <Text style={styles.buttonText}>VIDEO</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonText: {
    color: '#4A4A4A',
    fontSize: 14,
  },
});