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
  const [loading, setLoading] = useState(false);
  
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

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    rut: '',
    address: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRUT = (rut: string) => {
    // Formato: 12345678-9
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]$/;
    return rutRegex.test(rut);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      rut: '',
      address: '',
    };

    // Email
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
      isValid = false;
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    // Primer nombre
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El primer nombre es obligatorio';
      isValid = false;
    }

    // Apellido paterno
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido paterno es obligatorio';
      isValid = false;
    }

    // RUT
    if (!formData.rut) {
      newErrors.rut = 'El RUT es obligatorio';
      isValid = false;
    } else if (!validateRUT(formData.rut)) {
      newErrors.rut = 'RUT inválido (formato: 12345678-9)';
      isValid = false;
    }

    // Dirección
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

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
          second_last_name: formData.second_last_name || undefined,
          rut: formData.rut,
          phone: formData.phone || undefined,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Registro Exitoso',
          'Tu cuenta ha sido creada correctamente',
          [
            {
              text: 'Iniciar Sesión',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'No se pudo registrar');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'Ocurrió un error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              Good<Text style={styles.logoGreen}>Cars</Text>
            </Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>CREAR CUENTA</Text>
          <Text style={styles.subtitle}>Completa tus datos</Text>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONTRASEÑA *</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRMAR CONTRASEÑA *</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="Repite tu contraseña"
                secureTextEntry
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Primer Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PRIMER NOMBRE *</Text>
              <TextInput
                style={[styles.input, errors.first_name && styles.inputError]}
                value={formData.first_name}
                onChangeText={(text) => setFormData({ ...formData, first_name: text })}
                placeholder="Juan"
              />
              {errors.first_name ? <Text style={styles.errorText}>{errors.first_name}</Text> : null}
            </View>

            {/* Apellido Paterno */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>APELLIDO PATERNO *</Text>
              <TextInput
                style={[styles.input, errors.last_name && styles.inputError]}
                value={formData.last_name}
                onChangeText={(text) => setFormData({ ...formData, last_name: text })}
                placeholder="Pérez"
              />
              {errors.last_name ? <Text style={styles.errorText}>{errors.last_name}</Text> : null}
            </View>

            {/* Apellido Materno (Opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>APELLIDO MATERNO</Text>
              <TextInput
                style={styles.input}
                value={formData.second_last_name}
                onChangeText={(text) => setFormData({ ...formData, second_last_name: text })}
                placeholder="González (opcional)"
              />
            </View>

            {/* RUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>RUT *</Text>
              <TextInput
                style={[styles.input, errors.rut && styles.inputError]}
                value={formData.rut}
                onChangeText={(text) => setFormData({ ...formData, rut: text })}
                placeholder="12345678-9"
                maxLength={10}
              />
              {errors.rut ? <Text style={styles.errorText}>{errors.rut}</Text> : null}
            </View>

            {/* Teléfono (Opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TELÉFONO</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="+56912345678 (opcional)"
                keyboardType="phone-pad"
              />
            </View>

            {/* Dirección */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DIRECCIÓN *</Text>
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Av. Principal 123"
              />
              {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
            </View>

            {/* Botón Registrar */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="person-add" size={20} color="#FFF" />
                  <Text style={styles.registerButtonText}>REGISTRARSE</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Link a Login */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginLinkText}>
                ¿Ya tienes cuenta? <Text style={styles.loginLinkBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
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
  },
  registerButton: {
    flexDirection: 'row',
    backgroundColor: '#7CB342',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLinkBold: {
    fontWeight: 'bold',
    color: '#7CB342',
  },
});
