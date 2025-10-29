import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function VenderAuto() {
  const router = useRouter();

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={estilos.encabezadoLogo}>
          <Text style={estilos.tituloGoodCars}>
            <Text style={estilos.textoGood}>Good</Text>
            <Text style={estilos.textoCars}>Cars</Text>
          </Text>
        </View>

        {/* Opciones de publicación */}
        <View style={estilos.contenedorOpciones}>
          {/* Opción 1: Publicación con revisión mecánica */}
          <TouchableOpacity 
            style={estilos.tarjetaOpcion}
            onPress={() => router.push('/publicacion-con-revision')}
          >
            <View style={estilos.contenidoTarjeta}>
              <View style={estilos.iconosContainer}>
                <Text style={estilos.emojiIcono}>👨‍🔧</Text>
                <Text style={estilos.emojiIcono}>🚗</Text>
              </View>
              <Text style={estilos.textoOpcion}>PUBLICACIÓN CON{'\n'}REVISIÓN MECÁNICA</Text>
            </View>
          </TouchableOpacity>

          {/* Opción 2: Publicación propia */}
          <TouchableOpacity 
            style={estilos.tarjetaOpcion}
            onPress={() => router.push('/publicacion-propia')}
          >
            <View style={estilos.contenidoTarjeta}>
              <View style={estilos.iconosContainer}>
                <Text style={estilos.emojiIcono}>🚗</Text>
              </View>
              <Text style={estilos.textoOpcion}>PUBLICACIÓN{'\n'}PROPIA</Text>
            </View>
          </TouchableOpacity>

          {/* Opción 3: Subastar mi auto */}
          <TouchableOpacity 
            style={estilos.tarjetaOpcion}
            onPress={() => router.push('/subastar-auto')}
          >
            <View style={estilos.contenidoTarjeta}>
              <View style={estilos.iconosContainer}>
                <Text style={estilos.emojiIcono}>🚗</Text>
                <Text style={estilos.emojiIcono}>🔨</Text>
              </View>
              <Text style={estilos.textoOpcion}>SUBASTAR{'\n'}MI AUTO</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Navegación inferior */}
        <View style={estilos.navegacionInferior}>
          <TouchableOpacity 
            style={estilos.botonNavegacion}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-circle" size={50} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={estilos.botonNavegacion}
            onPress={() => router.push('/home')}
          >
            <Ionicons name="home" size={50} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
  },
  encabezadoLogo: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  tituloGoodCars: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  textoGood: {
    color: '#333',
  },
  textoCars: {
    color: '#4CAF50',
  },
  contenedorOpciones: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tarjetaOpcion: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    overflow: 'hidden',
  },
  contenidoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  iconosContainer: {
    flexDirection: 'row',
    marginRight: 20,
    gap: 5,
  },
  emojiIcono: {
    fontSize: 40,
  },
  textoOpcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  navegacionInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
    marginTop: 40,
  },
  botonNavegacion: {
    padding: 10,
  },
});
