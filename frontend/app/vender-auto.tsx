import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VenderAutoScreen() {
  const router = useRouter();

  const handlePublicacionRevision = () => {
    router.push('/publicacion-revision');
  };

  const handlePublicacionPropia = () => {
    router.push('/vender-auto-form');
  };

  const handleSubastar = () => {
    router.push('/subastar-auto');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            Good<Text style={styles.logoGreen}>Cars</Text>
          </Text>
        </View>

        {/* Opciones de venta */}
        <View style={styles.optionsContainer}>
          {/* Opción 1: Publicación con Revisión Mecánica */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handlePublicacionRevision}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="construct" size={40} color="#4A90E2" />
              <Ionicons name="car-sport" size={30} color="#333" style={styles.carIcon} />
            </View>
            <Text style={styles.optionTitle}>PUBLICACIÓN</Text>
            <Text style={styles.optionSubtitle}>CON REVISIÓN</Text>
            <Text style={styles.optionSubtitle}>MECÁNICA</Text>
          </TouchableOpacity>

          {/* Opción 2: Publicación Propia */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handlePublicacionPropia}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="car" size={50} color="#333" />
            </View>
            <Text style={styles.optionTitle}>PUBLICACIÓN</Text>
            <Text style={styles.optionSubtitle}>PROPIA</Text>
          </TouchableOpacity>

          {/* Opción 3: Subastar mi Auto */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleSubastar}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="hammer" size={40} color="#666" />
              <Ionicons name="car-sport" size={30} color="#333" style={styles.carIcon} />
            </View>
            <Text style={styles.optionTitle}>SUBASTAR</Text>
            <Text style={styles.optionSubtitle}>MI AUTO</Text>
          </TouchableOpacity>
        </View>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },
  logoGreen: {
    color: '#7CB342',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#B3E5FC',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  carIcon: {
    marginLeft: 10,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    marginTop: 20,
  },
  navButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
});
