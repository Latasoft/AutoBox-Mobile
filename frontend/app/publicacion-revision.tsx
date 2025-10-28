import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import VehicleFormLayout from '../components/VehicleFormLayout';

export default function PublicacionRevisionScreen() {
  const router = useRouter();

  return (
    <VehicleFormLayout
      title="PUBLICACIÓN CON"
      subtitle="REVISIÓN MECÁNICA"
    >
      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct" size={60} color="#4A90E2" />
          <Ionicons name="car-sport" size={50} color="#333" style={styles.carIcon} />
        </View>

        <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Completa la información de tu vehículo</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Solicita una inspección mecánica en un AutoBox</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Recibe el reporte de inspección certificado</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepText}>Tu vehículo se publica con el sello de calidad</Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Beneficios:</Text>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#7CB342" />
            <Text style={styles.benefitText}>Mayor confianza de compradores</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#7CB342" />
            <Text style={styles.benefitText}>Vende más rápido</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#7CB342" />
            <Text style={styles.benefitText}>Inspección profesional certificada</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/publicacion-revision-form')}
        >
          <Text style={styles.continueButtonText}>CONTINUAR</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </VehicleFormLayout>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    padding: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  carIcon: {
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  stepContainer: {
    marginBottom: 30,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  benefitsContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#666',
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#7CB342',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
