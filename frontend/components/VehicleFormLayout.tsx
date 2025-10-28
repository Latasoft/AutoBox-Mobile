import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VehicleFormLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function VehicleFormLayout({
  title,
  subtitle,
  children,
  showBackButton = true,
  showHomeButton = true,
}: VehicleFormLayoutProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              Good<Text style={styles.logoGreen}>Cars</Text>
            </Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          {/* Contenido del formulario */}
          {children}
        </View>
      </ScrollView>

      {/* Navegación inferior */}
      {(showBackButton || showHomeButton) && (
        <View style={styles.bottomNav}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={30} color="#4A90E2" />
            </TouchableOpacity>
          )}

          {showHomeButton && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/home')}
            >
              <Ionicons name="home" size={30} color="#7CB342" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#2C3E50',
    borderTopWidth: 1,
    borderTopColor: '#1A252F',
  },
  navButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
});
