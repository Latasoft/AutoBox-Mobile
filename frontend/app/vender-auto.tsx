import { Link, router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedView } from '../components/themed-view';

// Componente principal para la pantalla de vender auto
export default function VenderAuto() {
  // Función para navegar a la pantalla de publicación con revisión mecánica
  const navegarAPublicacionConRevision = () => {
    router.push('/publicacion-revision');
  };

  // Función para navegar a la pantalla de publicación propia
  const navegarAPublicacionPropia = () => {
    router.push('/publicacion-propia');
  };

  // Función para navegar a la pantalla de subasta
  const navegarASubasta = () => {
    router.push('/subastar-auto');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Logo GoodCars */}
      <Text style={styles.logo}>GoodCars</Text>

      {/* Botones de opciones */}
      <Pressable 
        style={styles.optionButton}
        onPress={navegarAPublicacionConRevision}
      >
        <Text style={styles.optionText}>PUBLICACIÓN CON REVISIÓN MECÁNICA</Text>
      </Pressable>

      <Pressable 
        style={styles.optionButton}
        onPress={navegarAPublicacionPropia}
      >
        <Text style={styles.optionText}>PUBLICACIÓN PROPIA</Text>
      </Pressable>

      <Pressable 
        style={styles.optionButton}
        onPress={navegarASubasta}
      >
        <Text style={styles.optionText}>SUBASTAR MI AUTO</Text>
      </Pressable>

      {/* Botones de navegación inferior */}
      <View style={styles.navigationButtons}>
        <Link href="/home" asChild>
          <Pressable style={styles.navButton}>
            <Text>←</Text>
          </Pressable>
        </Link>
        <Link href="/home" asChild>
          <Pressable style={styles.navButton}>
            <Text>⌂</Text>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  optionButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
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
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  navigationButtons: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});