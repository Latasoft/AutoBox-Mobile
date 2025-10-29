import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    second_last_name: '',
    rut: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.first_name || 
        !formData.last_name || !formData.rut || !formData.address) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (*)');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          second_last_name: formData.second_last_name,
          rut: formData.rut,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Éxito',
          'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth-login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      console.error('Error de registro:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
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
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Ionicons name="car" size={60} color="#7CB342" />
              <Text style={styles.logoText}>
                Good<Text style={styles.logoGreen}>Cars</Text>
              </Text>
            </View>

            {/* Título */}
            <Text style={styles.title}>CREAR CUENTA</Text>
            <Text style={styles.subtitle}>(*) Campos obligatorios</Text>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="correo@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CONTRASEÑA *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    placeholder="Mínimo 6 caracteres"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar Contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CONFIRMAR CONTRASEÑA *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    placeholder="Repite tu contraseña"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Primer Nombre */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PRIMER NOMBRE *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.first_name}
                    onChangeText={(text) => handleInputChange('first_name', text)}
                    placeholder="Juan"
                  />
                </View>
              </View>

              {/* Apellido Paterno */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>APELLIDO PATERNO *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.last_name}
                    onChangeText={(text) => handleInputChange('last_name', text)}
                    placeholder="Pérez"
                  />
                </View>
              </View>

              {/* Apellido Materno (Opcional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>APELLIDO MATERNO</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.second_last_name}
                    onChangeText={(text) => handleInputChange('second_last_name', text)}
                    placeholder="González"
                  />
                </View>
              </View>

              {/* RUT */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>RUT *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.rut}
                    onChangeText={(text) => handleInputChange('rut', text)}
                    placeholder="12345678-9"
                  />
                </View>
              </View>

              {/* Teléfono (Opcional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TELÉFONO</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    placeholder="+56912345678"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Dirección */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DIRECCIÓN *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                    placeholder="Calle 123, Depto 45"
                  />
                </View>
              </View>

              {/* Botón de registro */}
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="person-add" size={20} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Botón para ir a login */}
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push('/auth-login')}
              >
                <Text style={styles.loginLinkText}>¿Ya tienes cuenta? Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  logoGreen: {
    color: '#7CB342',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    marginBottom: 30,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  registerButton: {
    backgroundColor: '#7CB342',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    padding: 10,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
});
