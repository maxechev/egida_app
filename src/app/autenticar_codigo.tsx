import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const icon = require('../assets/images/logo_egida.png');

const AutenticarCodigo = () => {
  const { email } = useLocalSearchParams(); // Recibimos el mail de la pantalla anterior
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerificarCodigo = () => {
    if (code.length !== 6) { // Ajuste según la longitud de su código
      Alert.alert('Error', 'El código debe tener 6 dígitos.');
      return;
    }

    setIsLoading(true);

    // TODO: VALIDAR CÓDIGO CON FIREBASE O BACKEND C#
    // await verifyPasswordResetCode(auth, code);
    // O: await fetch('https://api-egida.com/auth/verify-code', { body: { email, code } })

    console.log('Verificando código:', code, 'para:', email);

    // Si es correcto, ir a cambiar contraseña
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/recuperar_contrasenia'); 
      // Usamos replace para que no puedan volver atrás al código con el botón físico
    }, 1000);
  };

  const handleReenviar = () => {
    Alert.alert('Código reenviado', `Hemos enviado un nuevo código a ${email}`);
    setCode('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Image source={icon} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.title}>Verificar identidad</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de 6 dígitos que enviamos a tu correo.
        </Text>

        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="000000"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))} // Solo permite números
          textAlign="center"
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleVerificarCodigo}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Verificando...' : 'Confirmar código'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReenviar} style={{ marginTop: 20 }}>
          <Text style={styles.resendText}>¿No recibiste el código? Reenviar</Text>
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
  codeInput: { letterSpacing: 8, fontSize: 20, fontWeight: 'bold' }, // Estilo especial para códigos
  button: { width: '100%', height: 45, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  resendText: { color: '#A0AABF', fontSize: 14, textDecorationLine: 'underline' },
});

export default AutenticarCodigo;