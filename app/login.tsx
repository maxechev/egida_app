import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const icon = require('../assets/images/logo_egida.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    // Validación básica antes de llamar a Firebase
    if (!email || !email.includes('@')) {
      Alert.alert(
        'Atención', 
        'Por favor ingresa tu correo electrónico en el campo superior antes de solicitar recuperación.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      
      Alert.alert(
        'Correo enviado', 
        'Revisa tu bandeja de entrada (y spam). El link de restablecimiento es válido por 1 hora.',
        [{ text: 'Entendido' }]
      );
    } catch (error: any) {
      let mensaje = 'Ocurrió un error al procesar tu solicitud.';
      
      // Traducción de errores de Firebase para mejor UX
      switch (error.code) {
        case 'auth/user-not-found':
          mensaje = 'No encontramos una cuenta asociada a ese correo electrónico.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/too-many-requests':
          mensaje = 'Demasiados intentos. Por favor espera unos minutos y vuelve a intentar.';
          break;
      }
      
      Alert.alert('Error', mensaje);
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

      {/* BOTÓN DE RECUPERACIÓN INTEGRADO CON FIREBASE */}
      <TouchableOpacity
        onPress={handleForgotPassword}
        disabled={isLoading}
        style={styles.forgotContainer}
      >
        <Text style={[styles.forgotText, isLoading && styles.disabledText]}>
          ¿Olvidó su contraseña?
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