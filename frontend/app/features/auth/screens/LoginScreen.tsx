import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../../../contexts/AuthContext';
import LoginCard from '../components/LoginCard';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log('🔐 Intentando login con:', username);
      await login(username, password);
      console.log('✅ Login exitoso');
      // La redirección se maneja automáticamente por el AuthContext
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      // Determinar el mensaje de error específico
      let errorTitle = '🚫 Error de autenticación';
      let errorMessage = 'No se pudo iniciar sesión. Verifica tus credenciales.';

      if (error && error.message) {
        console.log('📧 Mensaje de error:', error.message);
        // Mensajes específicos del backend
        if (error.message.includes('correo electrónico es incorrecto') || error.message.includes('correo electrónico es incorrecto')) {
          errorTitle = '📧 Correo Incorrecto';
          errorMessage = 'El correo electrónico ingresado no existe en el sistema.';
        } else if (error.message.includes('contraseña es incorrecta')) {
          errorTitle = '🔑 Contraseña Incorrecta';
          errorMessage = 'La contraseña ingresada es incorrecta. Por favor, inténtalo de nuevo.';
        } else if (error.message.includes('formato del correo')) {
          errorTitle = '⚠️ Formato Inválido';
          errorMessage = 'El formato del correo electrónico es inválido.';
        } else if (error.message.includes('Usuario inactivo')) {
          errorTitle = '🚫 Usuario Inactivo';
          errorMessage = 'Tu cuenta está inactiva. Contacta al administrador.';
        } else if (error.message.includes('conexión') || error.message.includes('Network')) {
          errorTitle = '🌐 Error de Conexión';
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else {
          errorMessage = error.message;
        }
      }

      console.log('🚨 Mostrando alerta:', errorTitle, '-', errorMessage);
      Alert.alert(errorTitle, errorMessage, [{ text: 'OK' }]);
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