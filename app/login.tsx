import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';

const icon = require('../assets/images/logo_egida.png');

export default function HomeScreen() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Image source={icon} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
            backgroundColor: '#F0F0F2',
            width: 250,
            height: 40,
            marginBottom: 20,
            paddingHorizontal: 10,
        }}
        />

        <TouchableOpacity
        style={{
            backgroundColor: '#F0F0F2',
            width: 130,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        onPress={() => router.replace('/home')}
        >
        <Text
            style={{
            color: '#10172B',
            fontSize: 16,
            fontWeight: 'bold',
            }}
        >
            Iniciar sesión
        </Text>
        </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={() => router.replace('/home')}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/register')}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#10172B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: { width: 180, height: 180, marginBottom: 20 },
  title: { color: '#F0F0F2', fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  input: {
    backgroundColor: '#F0F0F2',
    width: '100%',
    maxWidth: 320,
    height: 48,
    marginBottom: 15,
    paddingHorizontal: 16,
    borderRadius: 6,
    color: '#000',
    fontSize: 15,
  },
  forgotContainer: { alignSelf: 'flex-end', marginBottom: 25, maxWidth: 320, width: '100%' },
  forgotText: { color: '#A0AABF', fontSize: 13, textAlign: 'right' },
  disabledText: { opacity: 0.5 },
  button: {
    backgroundColor: '#F0F0F2',
    width: 150,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 15,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#10172B', fontSize: 16, fontWeight: 'bold' },
};