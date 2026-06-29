import { Ionicons } from '@expo/vector-icons'; // Librería nativa de Expo para íconos profesionales
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const icon = require('../assets/images/logo_egida.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Nuevo estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

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
        autoCapitalize="none" // Evita que el teclado sugiera mayúsculas al inicio del email
        style={styles.input}
      />

      {/* Contenedor relativo para posicionar el ojito dentro del input */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword} // Alterna entre oculto y visible
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none" // CRÍTICO: Evita que iOS/Android pongan mayúscula automática al primer caracter
          style={[styles.input, styles.passwordInput]}
        />
        
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
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
  // Estilos nuevos para el campo de contraseña con ojito
  passwordContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 320,
    marginBottom: 15,
  },
  passwordInput: {
    marginBottom: 0, // Quitamos el margin bottom porque el contenedor lo maneja
    paddingRight: 50, // Espacio interno para que el texto no se superponga con el ojo
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  forgotContainer: { alignSelf: 'flex-end', marginBottom: 25, maxWidth: 320, width: '100%'},
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
});