import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
          options={{ title: 'Inicio' }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Login',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            title: 'Registro',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="forgot-password" 
          options={{ 
            title: 'Recuperar Contraseña',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Home',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="solicitar-mecanico" 
          options={{ 
            title: 'Solicitar Mecánico',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="vender-auto" 
          options={{ 
            title: 'Vender Mi Auto',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="publicacion-con-revision" 
          options={{ 
            title: 'Publicación con Revisión',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="publicacion-propia" 
          options={{ 
            title: 'Publicación Propia',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="subastar-auto" 
          options={{ 
            title: 'Subastar Auto',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="publicacion-revision-form" 
          options={{ 
            title: 'Formulario Revisión',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="subastar-form" 
          options={{ 
            title: 'Formulario Subasta',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="vender-auto-form" 
          options={{ 
            title: 'Formulario de Venta',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Configuración',
            headerShown: false,
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}
