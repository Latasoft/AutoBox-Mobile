import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import LoginCard from './features/auth/components/LoginCard';

export default function Index() {
  const router = useRouter();

  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt:', { username, password });
    
    if (username && password) {
      alert(`¡Bienvenido ${username}!`);
      router.push('/home');
    } else {
      alert('Por favor ingresa usuario y contraseña');
    }
  };

  // Función temporal para ir directo al home (para desarrollo)
  const irAlHome = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AutoBox Mobile</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      
      <View style={styles.cardContainer}>
        <LoginCard onLogin={handleLogin} />
      </View>

      {/* Botón temporal para desarrollo - puedes quitarlo después */}
      <TouchableOpacity style={styles.devButton} onPress={irAlHome}>
        <Text style={styles.devButtonText}>🚀 Ver Home (Desarrollo)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#14345b',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
  },
  // Estilos para el botón temporal
  devButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  devButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
