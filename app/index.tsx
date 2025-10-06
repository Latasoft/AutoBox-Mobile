import { View, Text, StyleSheet } from 'react-native';
import LoginCard from './features/auth/components/LoginCard';

export default function HomeTab() {
  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt:', { username, password });
    // Aquí puedes implementar la lógica de autenticación
    alert(`Login: ${username} / ${password}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WSA React Native</Text>
      <Text style={styles.subtitle}>Login Card Demo</Text>
      
      <View style={styles.cardContainer}>
        <LoginCard onLogin={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#14345b',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
  },
});
