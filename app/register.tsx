import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { auth } from './firebase/config'; // Ajusta la ruta según tu estructura
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

const icon = require('../assets/images/logo_egida.png');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  
  // Estados para fecha de nacimiento
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Formatear fecha a DD/MM/AAAA (formato argentino)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  // Validación de edad mínima (13 años para Égida)
  const isAgeValid = (date: Date): boolean => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age >= 13;
  };

  const register = async () => {
    // Validaciones básicas
    if (!nombre || !apellido || !telefono || !dni || !ocupacion || !email || !password) {
      Alert.alert('Error', 'Complete todos los campos obligatorios.');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Error', 'Seleccione su fecha de nacimiento.');
      return;
    }

    if (!isAgeValid(selectedDate)) {
      Alert.alert('Error', 'Debes tener al menos 13 años para registrarte en Égida.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      
      // TODO: Guardar datos adicionales (nombre, apellido, etc.) en Firestore o backend C#
      console.log('Usuario registrado:', userCredential.user.uid);
      
      Alert.alert(
        'Verificación enviada', 
        'Revisa tu correo electrónico para activar tu cuenta.',
        [{ text: 'OK', onPress: () => router.replace('/verify-email') }]
      );
    } catch (error: any) {
      let mensaje = 'Ocurrió un error al registrarse.';
      if (error.code === 'auth/email-already-in-use') mensaje = 'Este correo ya está registrado.';
      if (error.code === 'auth/invalid-email') mensaje = 'El formato del correo no es válido.';
      if (error.code === 'auth/weak-password') mensaje = 'La contraseña es demasiado débil.';
      Alert.alert('Error', mensaje);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Botón Volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Logo Égida */}
      <Image source={icon} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Registrarse</Text>

      {/* Campos de texto */}
      <TextInput placeholder="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <TextInput placeholder="Confirmar contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />

      <View style={styles.row}>
        <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.halfInput} />
        <TextInput placeholder="Apellido" value={apellido} onChangeText={setApellido} style={styles.halfInput} />
      </View>

      <View style={styles.row}>
        <TextInput placeholder="Teléfono" value={telefono} onChangeText={setTelefono} style={styles.halfInput} keyboardType="phone-pad" />
        <TextInput placeholder="DNI" value={dni} onChangeText={setDni} style={styles.halfInput} keyboardType="numeric" maxLength={8} />
      </View>

      {/* Selector de Fecha Nativo */}
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.halfInput, styles.dateButton]} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: selectedDate ? '#000' : '#999', fontSize: 14 }}>
            {selectedDate ? formatDate(selectedDate) : 'Fecha nacim.'}
          </Text>
        </TouchableOpacity>
        
        <TextInput placeholder="Ocupación" value={ocupacion} onChangeText={setOcupacion} style={styles.halfInput} />
      </View>

      {/* Modal con DatePicker nativo */}
      {showDatePicker && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate || new Date(2005, 0, 1)} // Default ~19 años
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  if (event.type === 'dismissed') {
                    setShowDatePicker(false);
                  } else if (date) {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }
                }}
                maximumDate={new Date()} // No permitir fechas futuras
                minimumDate={new Date(1900, 0, 1)} // Límite razonable
                textColor="#000"
                accentColor="#10172B"
              />
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Botón de Registro */}
      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  container: { flex: 1, backgroundColor: '#10172B', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  backButton: { position: 'absolute', left: 20, top: 50, zIndex: 10, padding: 10 },
  backArrow: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  logo: { width: 140, height: 140, marginBottom: 10 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 25 },
  input: { backgroundColor: '#F0F0F2', width: '100%', maxWidth: 320, height: 45, marginBottom: 12, paddingHorizontal: 15, borderRadius: 6, fontSize: 15, color: '#000' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12, width: '100%', maxWidth: 320, justifyContent: 'space-between' },
  halfInput: { backgroundColor: '#F0F0F2', width: '48%', height: 45, paddingHorizontal: 12, borderRadius: 6, fontSize: 14, color: '#000' },
  dateButton: { justifyContent: 'center', alignItems: 'flex-start' },
  button: { backgroundColor: '#F0F0F2', width: 150, height: 48, justifyContent: 'center', alignItems: 'center', marginTop: 25, borderRadius: 6 },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: '#10172B' },
  // Estilos del Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, alignItems: 'center', width: '85%', maxWidth: 350 },
  modalCloseButton: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 30, backgroundColor: '#10172B', borderRadius: 6 },
  modalCloseText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});