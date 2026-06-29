import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      // TODO: Aquí irá la lógica de Firebase / Backend C# para guardar la alerta
      // await crearAlerta({ motivo, timestamp: new Date(), userId: ... });
      
      console.log(`✅ Alerta de "${motivo}" enviada exitosamente.`);
      
      // Redirección inmediata al mapa según métrica de éxito del MVP
      router.replace('/home'); 
      
    } catch (error) {
      console.error('Error al enviar alerta:', error);
      Alert.alert('Error', 'No se pudo enviar la alerta. Verifique su conexión.');
      setIsLoading(false);
    }
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

        {/* Botón de Acción */}
        <TouchableOpacity
          style={{
            backgroundColor: isLoading ? '#CC3333' : '#FF4444',
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            marginTop: 'auto',
            marginBottom: 20,
            opacity: isLoading ? 0.8 : 1,
          }}
          onPress={handleEnviarAlerta}
          disabled={isLoading}
        >
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>
            {isLoading ? 'ENVIANDO...' : 'ENVIAR ALERTA'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}