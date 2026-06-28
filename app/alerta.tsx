import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AlertaScreen() {
  const [motivo, setMotivo] = useState('');

  const handleEnviarAlerta = () => {
    if (!motivo) {
      Alert.alert('Error', 'Por favor seleccione un motivo antes de enviar.');
      return;
    }
    
    // Aquí irá la lógica de Firebase más adelante
    Alert.alert('Égida', `Alerta de ${motivo} enviada a la red.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#10172B' }}>
      <View style={{ flex: 1, padding: 20 }}>
        
        {/* Header simple */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
            <Text style={{ color: 'white', fontSize: 28 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Nueva Alerta</Text>
        </View>

        {/* Selector de Motivo */}
        <View style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 20 }}>
          <Picker
            selectedValue={motivo}
            onValueChange={(itemValue) => setMotivo(itemValue)}
            style={{ height: 50, width: '100%' }}
          >
            <Picker.Item label="Seleccione el motivo" value="" />
            <Picker.Item label="Robo" value="Robo" />
            <Picker.Item label="Secuestro de vehículo" value="Secuestro de vehículo" />
            <Picker.Item label="Allanamiento" value="Allanamiento" />
            <Picker.Item label="Secuestro" value="Secuestro" />
            <Picker.Item label="Actividad sospechosa" value="Actividad sospechosa" />
            <Picker.Item label="Disparos de arma de fuego" value="Disparos de arma de fuego" />
          </Picker>
        </View>

        {/* Botón de Acción - Empujado al fondo con marginTop: 'auto' */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FF4444',
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            marginTop: 'auto', // Esto lo pega al fondo dinámicamente
            marginBottom: 20,
          }}
          onPress={handleEnviarAlerta}
        >
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>
            ENVIAR ALERTA
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}