import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import LoginCard from '../components/LoginCard';
import { useAuth } from '../hooks/useAuth';
import { AuthError } from '../types';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      await login({ username, password });
      
      // Si el login es exitoso, navegar a la pantalla principal
      Alert.alert(
        'Éxito',
        'Inicio de sesión exitoso',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      // El error ya se maneja en el hook useAuth
      // Aquí solo mostramos una alerta al usuario
      const authError = error as AuthError;
      Alert.alert(
        'Error de autenticación',
        authError.message || 'No se pudo iniciar sesión. Verifica tus credenciales.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LoginCard onLogin={handleLogin} isLoading={isLoading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
  },
});