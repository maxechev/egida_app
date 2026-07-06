import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Cargar el icono una sola vez fuera del componente para optimizar rendimiento
const icon = require('../assets/images/logo_egida.png');

const CheckIcon = () => (
  <View style={styles.checkCircle}>
    <Text style={styles.checkMark}>✓</Text>
  </View>
);

const RecuperarContrasenia = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirmar = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // TODO: Aquí conectarás con Firebase o tu backend C#
    console.log('Contraseña actualizada:', password);
    setIsSuccess(true);
  };

  // --- VISTA DE ÉXITO ---
  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentCentered}>
          <CheckIcon />
          <Text style={styles.title}>Contraseña cambiada</Text>
          <Text style={styles.subtitle}>
            ¡Su contraseña ha sido exitosamente recuperada! ahora puede volver al menú de iniciar sesión
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- VISTA DEL FORMULARIO ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Botón Atrás funcional */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        {/* Logo Égida integrado correctamente */}
        <Image
          source={icon}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>Ingrese su nueva contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Contraseña nueva"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Repetir contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleConfirmar}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1325' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
  backArrow: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  contentCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  
  // Estilo nuevo para el logo
  logo: { width: 150, height: 150, marginBottom: 30 },
  
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: '#A0AABF', fontSize: 14, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  input: { width: '100%', height: 50, backgroundColor: '#EAEAEA', borderRadius: 4, paddingHorizontal: 15, marginBottom: 20, color: '#333', fontSize: 16 },
  button: { width: '100%', height: 45, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginTop: 10 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  checkCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  checkMark: { color: '#FFF', fontSize: 60, fontWeight: '300', marginTop: -5 },
});

export default RecuperarContrasenia;