import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VehicleFormLayout from '../components/VehicleFormLayout';

export default function SubastarAutoScreen() {
  const router = useRouter();

  return (
    <VehicleFormLayout
      title="SUBASTAR"
      subtitle="MI AUTO"
    >
      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="hammer" size={60} color="#FF9800" />
          <Ionicons name="car-sport" size={50} color="#333" style={styles.carIcon} />
        </View>

        <Text style={styles.infoTitle}>¿Cómo funciona la subasta?</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Publica tu vehículo con precio base de subasta</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Los compradores realizan ofertas durante el tiempo establecido</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>La oferta más alta al final gana</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepText}>Coordinamos la entrega con el ganador</Text>
          </View>
        </View>

        <View style={styles.typesContainer}>
          <Text style={styles.typesTitle}>Tipos de Subasta:</Text>
          
          <TouchableOpacity 
            style={styles.typeCard}
            onPress={() => router.push('/subastar-form?type=standard')}
          >
            <View style={styles.typeHeader}>
              <Ionicons name="time-outline" size={30} color="#4A90E2" />
              <Text style={styles.typeName}>Subasta Estándar</Text>
            </View>
            <Text style={styles.typeDescription}>
              Duración fija de 7 días. La oferta más alta gana.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.typeCard}
            onPress={() => router.push('/subastar-form?type=reserve')}
          >
            <View style={styles.typeHeader}>
              <Ionicons name="shield-checkmark-outline" size={30} color="#7CB342" />
              <Text style={styles.typeName}>Subasta con Reserva</Text>
            </View>
            <Text style={styles.typeDescription}>
              Establece un precio mínimo de venta. Si no se alcanza, no hay obligación de vender.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.typeCard}
            onPress={() => router.push('/subastar-form?type=dutch')}
          >
            <View style={styles.typeHeader}>
              <Ionicons name="trending-down-outline" size={30} color="#FF9800" />
              <Text style={styles.typeName}>Subasta Holandesa</Text>
            </View>
            <Text style={styles.typeDescription}>
              El precio baja automáticamente con el tiempo hasta que alguien acepta.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Beneficios:</Text>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#7CB342" />
            <Text style={styles.benefitText}>Obtén el mejor precio del mercado</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#7CB342" />
            <Text style={styles.benefitText}>Proceso transparente y seguro</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#7CB342" />
            <Text style={styles.benefitText}>Múltiples compradores compitiendo</Text>
          </View>
        </View>
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
    backgroundColor: '#FF9800',
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
  typesContainer: {
    marginBottom: 30,
  },
  typesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  typeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  benefitsContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
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
});
