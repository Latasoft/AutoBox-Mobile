import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginCardProps {
  onLogin: (username: string, password: string) => void;
  isLoading?: boolean;
}

export default function LoginCard({ onLogin, isLoading = false }: LoginCardProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    onLogin(username, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {/* Fondo con imagen heroica */}
      <View style={styles.heroBg}>
        {/* Por ahora usamos un degradado en lugar de imagen */}
        <View style={styles.heroGradient} />
      </View>

      {/* Card principal de login */}
      <View style={styles.loginCard}>
        {/* Logo flotante */}
        <View style={styles.loginIcon}>
          <Text style={styles.logoText}>WSA</Text>
        </View>

        {/* Encabezado */}
        <View style={styles.headerSection}>
          <Text style={styles.loginHeader}>Welcome</Text>
          <Text style={styles.loginSubtitle}>Enter your credentials</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formSection}>
          {/* Campo de usuario */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Campo de contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#51565d"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón de login */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Enlaces auxiliares */}
        <View style={styles.auxLinks}>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>¿Forgot Your Password?</Text>
          </TouchableOpacity>

          {/* Imágenes de dispositivos */}
          <View style={styles.deviceImages}>
            <View style={styles.devicePlaceholder}>
              <Text style={styles.deviceText}>💻</Text>
            </View>
            <View style={styles.devicePlaceholder}>
              <Text style={styles.deviceText}>📱</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
    position: 'relative',
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    zIndex: 1,
  },
  heroGradient: {
    flex: 1,
    backgroundColor: '#14345b', // Azul oscuro similar al del diseño original
  },
  loginCard: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginHorizontal: '5%',
    marginTop: '28%',
    maxWidth: 360,
    alignSelf: 'center',
    width: '90%',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  loginIcon: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14345b',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: '#14345b',
    marginBottom: 4,
  },
  loginSubtitle: {
    fontSize: 15,
    color: '#51565d',
    marginBottom: 0,
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#51565d',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#51565d',
    backgroundColor: 'transparent',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 4,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#51565d',
    backgroundColor: 'transparent',
  },
  eyeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  loginButton: {
    backgroundColor: '#77cdcd',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  auxLinks: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#14345b',
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'none',
  },
  deviceImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 20,
  },
  devicePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  deviceText: {
    fontSize: 24,
  },
});