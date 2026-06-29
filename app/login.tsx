import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const icon = require('../assets/images/logo_egida.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lógica de Recuperación (Tu versión optimizada)
  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Atención', 'Ingresa tu correo electrónico antes de solicitar recuperación.');
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Correo enviado', 
        'Revisa tu bandeja (y spam). El link es válido por 1 hora.',
        [{ text: 'Entendido' }]
      );
    } catch (error: any) {
      let msg = 'Error al procesar la solicitud.';
      if (error.code === 'auth/user-not-found') msg = 'No existe cuenta con ese correo.';
      if (error.code === 'auth/invalid-email') msg = 'Formato de correo inválido.';
      if (error.code === 'auth/too-many-requests') msg = 'Demasiados intentos. Espera unos minutos.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Login (Versión de tu colega integrada y estilizada)
  const login = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Complete correo y contraseña.');
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/home');
    } catch (error: any) {
      let msg = 'Ocurrió un error al iniciar sesión.';
      switch (error.code) {
        case 'auth/invalid-credential':
          msg = 'Correo o contraseña incorrectos.';
          break;
        case 'auth/network-request-failed':
          msg = 'Sin conexión a Internet. Verifique su red.';
          break;
        case 'auth/user-disabled':
          msg = 'Esta cuenta ha sido deshabilitada.';
          break;
      }
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

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
        style={styles.input}
      />

      {/* Botón de Recuperación */}
      <TouchableOpacity
        onPress={handleForgotPassword}
        disabled={isLoading}
        style={styles.forgotContainer}
      >
        <Text style={[styles.forgotText, isLoading && styles.disabledText]}>
          ¿Olvidó su contraseña?
        </Text>
      </TouchableOpacity>

      {/* Botón de Login Integrado */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={login}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
        </Text>
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