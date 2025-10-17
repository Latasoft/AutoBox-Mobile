import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  useEffect(() => {
    console.log('🚀 Frontend iniciado correctamente');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 AutoBox Mobile</Text>
      <Text style={styles.subtitle}>✅ Frontend funcionando correctamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
  },
});