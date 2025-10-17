import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PropiedadesBotonAccion {
  icono: keyof typeof Ionicons.glyphMap;
  etiqueta: string;
  alPresionar: () => void;
  colorFondo?: string;
  colorTexto?: string;
}

export default function BotonAccion({
  icono,
  etiqueta,
  alPresionar,
  colorFondo = '#4CAF50',
  colorTexto = '#fff',
}: PropiedadesBotonAccion) {
  return (
    <TouchableOpacity
      style={[estilos.contenedor, { backgroundColor: colorFondo }]}
      onPress={alPresionar}
      activeOpacity={0.8}
    >
      <View style={estilos.contenidoBoton}>
        <Ionicons name={icono} size={24} color={colorTexto} />
        <Text style={[estilos.texto, { color: colorTexto }]}>{etiqueta}</Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contenidoBoton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  texto: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 12,
  },
});