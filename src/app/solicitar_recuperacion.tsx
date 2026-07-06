import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const icon = require('../assets/images/logo_egida.png');

const SolicitarRecuperacion = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnviarCodigo = async () => {
    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingrese un correo válido.');
      return;
    }

    setIsLoading(true);
    
    // TODO: INTEGRACIÓN FIREBASE O BACKEND C#
    // await sendPasswordResetEmail(getAuth(), email); 
    // O llamar a su API C#: await fetch('https://api-egida.com/auth/request-code', ...)
    
    console.log('Solicitando recuperación para:', email);
    
    // Simulamos éxito y navegamos a la pantalla de confirmar código
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/autenticar_codigo',
        params: { email: email } // Pasamos el mail para referencia
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Image source={icon} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Ingrese su correo electrónico para recibir un código de verificación.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleEnviarCodigo}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Enviando...' : 'Enviar código'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1325' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
  backArrow: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  logo: { width: 150, height: 150, marginBottom: 30 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: '#A0AABF', fontSize: 14, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  input: { width: '100%', height: 50, backgroundColor: '#EAEAEA', borderRadius: 4, paddingHorizontal: 15, marginBottom: 20, color: '#333', fontSize: 16 },
  button: { width: '100%', height: 45, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
});

export default SolicitarRecuperacion;