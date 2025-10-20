import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MarcaAuto } from '../types/auto';

interface PropiedadesSliderMarcas {
  marcas: MarcaAuto[];
  alSeleccionarMarca?: (marca: MarcaAuto) => void;
}

const { width } = Dimensions.get('window');
const anchoMarca = width / 4 - 12; // 4 marcas por fila con espaciado

export default function SliderMarcas({
  marcas,
  alSeleccionarMarca,
}: PropiedadesSliderMarcas) {
  const manejarSeleccionMarca = (marca: MarcaAuto) => {
    console.log('Marca seleccionada:', marca.nombre);
    if (alSeleccionarMarca) {
      alSeleccionarMarca(marca);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.contenidoScroll}
      >
        {marcas.map((marca) => (
          <TouchableOpacity
            key={marca.id}
            style={estilos.marcaContenedor}
            onPress={() => manejarSeleccionMarca(marca)}
            activeOpacity={0.7}
          >
            <View style={estilos.marcaIcono}>
              <Ionicons name="car" size={30} color="#666" />
            </View>
            <Text style={estilos.marcaNombre}>{marca.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginTop: 8,
  },
  contenidoScroll: {
    paddingHorizontal: 16,
  },
  marcaContenedor: {
    alignItems: 'center',
    marginRight: 16,
    width: anchoMarca,
  },
  marcaIcono: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  marcaNombre: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});