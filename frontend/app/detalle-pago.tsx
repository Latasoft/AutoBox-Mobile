import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedView } from '../components/themed-view';

export default function DetallePago() {
  // Funciones para manejar las diferentes opciones de pago
  const handleDescontarSaldo = () => {
    // Lógica para descontar del saldo
    console.log('Descontar del saldo');
  };

  const handlePagoTarjeta = () => {
    // Lógica para pago con tarjeta
    console.log('Pago con tarjeta');
  };

  const handleTransferencia = () => {
    // Lógica para transferencia bancaria
    console.log('Transferencia bancaria');
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.logo}>GoodCars</Text>

      {/* Sección de pago */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>PAGO PUBLICACIÓN</Text>
        <Text style={styles.paymentTitle}>VERIFICACIÓN LEGAL</Text>
        <Text style={styles.amount}>$20.000</Text>

        {/* Logo WebPay */}
        <View style={styles.webpayContainer}>
          <Text>GOODCARS</Text>
          {/* Aquí iría el logo de WebPay */}
        </View>

        {/* Opciones de pago */}
        <Pressable style={styles.paymentOption} onPress={handleDescontarSaldo}>
          <Text>DESCONTAR SALDO</Text>
        </Pressable>

        <Pressable style={styles.paymentOption} onPress={handlePagoTarjeta}>
          <Text>TCR DÉBITO / CRÉDITO</Text>
        </Pressable>

        <Pressable style={styles.paymentOption} onPress={handleTransferencia}>
          <Text>TRANSFERENCIA BANCARIA</Text>
        </Pressable>
      </View>

      {/* Botones de navegación */}
      <View style={styles.navigationButtons}>
        <Link href="/publicacion-propia" asChild>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  paymentSection: {
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  webpayContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  paymentOption: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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