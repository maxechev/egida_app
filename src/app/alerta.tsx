import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from './firebase/config';

export default function AlertaScreen() {
  const [motivo, setMotivo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnviarAlerta = async () => {
    if (!motivo) {
      Alert.alert('Error', 'Por favor seleccione un motivo antes de enviar.');
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Debes iniciar sesión para enviar una alerta.');

      // 1. Obtener geolocalización precisa
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Permiso de ubicación requerido.');

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // ✅ NUEVO: Calcular dirección legible inmediatamente
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const direccionTexto = address
        ? `${address.street || ''} ${address.streetNumber || ''}, ${address.city || address.subregion || ''}`.trim()
        : 'Ubicación desconocida';

      // 2. Guardar con nueva estructura optimizada
      await addDoc(collection(db, 'alertas_demo'), {
        userId: user.uid,
        motivo: motivo,
        estado: 'En proceso',
        redId: 'barrio-demo-1',
        timestamp: serverTimestamp(),
        
        // ✅ Campos separados para optimización futura
        coordenadas: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        direccion: direccionTexto,
      });

      console.log(`✅ Alerta enviada: ${motivo} | 📍 ${direccionTexto}`);
      router.replace('/home');

    } catch (error: any) {
      console.error('❌ Error:', error.code, error.message);
      Alert.alert('Error', error.message || 'No se pudo enviar la alerta.');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#10172B' }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <TouchableOpacity onPress={() => !isLoading && router.back()} style={{ marginRight: 15 }}>
            <Text style={{ color: 'white', fontSize: 28 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Nueva Alerta</Text>
        </View>

        {/* Selector */}
        <View style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 20 }}>
          <Picker selectedValue={motivo} onValueChange={(v) => setMotivo(v)} enabled={!isLoading}>
            <Picker.Item label="Seleccione el motivo" value="" />
            <Picker.Item label="Robo" value="Robo" />
            <Picker.Item label="Secuestro de vehículo" value="Secuestro de vehículo" />
            <Picker.Item label="Allanamiento" value="Allanamiento" />
            <Picker.Item label="Secuestro" value="Secuestro" />
            <Picker.Item label="Actividad sospechosa" value="Actividad sospechosa" />
            <Picker.Item label="Disparos de arma de fuego" value="Disparos de arma de fuego" />
          </Picker>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={{
            backgroundColor: isLoading ? '#CC3333' : '#FF4444',
            width: '100%', height: 60, justifyContent: 'center', alignItems: 'center',
            borderRadius: 12, marginTop: 'auto', marginBottom: 20, opacity: isLoading ? 0.8 : 1,
          }}
          onPress={handleEnviarAlerta}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>ENVIAR ALERTA</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}