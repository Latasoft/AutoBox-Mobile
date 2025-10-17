import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Auto } from '../types/auto';

interface PropiedadesGrillaAutos {
  autos: Auto[];
  alSeleccionarAuto?: (auto: Auto) => void;
  numeroColumnas?: number;
}

const { width } = Dimensions.get('window');
const anchoTarjeta = (width - 48) / 3; // 3 columnas con espaciado

export default function GrillaAutos({
  autos,
  alSeleccionarAuto,
  numeroColumnas = 3,
}: PropiedadesGrillaAutos) {
  const manejarSeleccionAuto = (auto: Auto) => {
    console.log('Auto seleccionado:', auto.marca, auto.modelo);
    if (alSeleccionarAuto) {
      alSeleccionarAuto(auto);
    }
  };

  const manejarToggleFavorito = (autoId: string) => {
    console.log('Toggle favorito para auto:', autoId);
    // Aquí irá la lógica para agregar/quitar de favoritos
  };

  const renderizarAuto = ({ item }: { item: Auto }) => (
    <TouchableOpacity
      style={estilos.tarjetaAuto}
      onPress={() => manejarSeleccionAuto(item)}
      activeOpacity={0.8}
    >
      <View style={estilos.contenedorImagen}>
        <Image source={{ uri: item.imagen }} style={estilos.imagenAuto} />
        
        {/* Botón de favorito */}
        <TouchableOpacity
          style={estilos.botonFavorito}
          onPress={() => manejarToggleFavorito(item.id)}
        >
          <Ionicons
            name={item.esFavorito ? 'heart' : 'heart-outline'}
            size={16}
            color={item.esFavorito ? '#FF5722' : '#666'}
          />
        </TouchableOpacity>

        {/* Indicador de inspección */}
        {item.tieneInspeccion && (
          <View style={estilos.indicadorInspeccion}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          </View>
        )}
      </View>

      <View style={estilos.infoAuto}>
        <Text style={estilos.marcaModelo} numberOfLines={1}>
          {item.marca}
        </Text>
        <Text style={estilos.modeloAño} numberOfLines={1}>
          {item.modelo}
        </Text>
        <Text style={estilos.precio}>
          ${item.precio.toLocaleString()}
        </Text>
        <Text style={estilos.kilometraje}>
          {item.kilometraje.toLocaleString()} km
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={autos}
        renderItem={renderizarAuto}
        keyExtractor={(item) => item.id}
        numColumns={numeroColumnas}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={numeroColumnas > 1 ? estilos.fila : null}
        contentContainerStyle={estilos.contenidoLista}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  contenidoLista: {
    paddingBottom: 16,
  },
  fila: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tarjetaAuto: {
    width: anchoTarjeta,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 12,
  },
  contenedorImagen: {
    position: 'relative',
    width: '100%',
    height: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  imagenAuto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  botonFavorito: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicadorInspeccion: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoAuto: {
    padding: 8,
  },
  marcaModelo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  modeloAño: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  precio: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  kilometraje: {
    fontSize: 9,
    color: '#999',
  },
});