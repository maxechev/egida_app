import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function AlertaScreen() {
  const [motivo, setMotivo] = useState('');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#10172B',
        alignItems: 'center',
        paddingTop: 60,
      }}
    >
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 20,
          top: 50,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Picker
        selectedValue={motivo}
        onValueChange={(itemValue) => setMotivo(itemValue)}
        style={{
          width: 300,
          backgroundColor: 'white',
        }}
      >
        <Picker.Item
          label="Seleccione el motivo"
          value=""
        />

        <Picker.Item
          label="Robo"
          value="Robo"
        />

        <Picker.Item
          label="Secuestro de vehículo"
          value="Secuestro de vehículo"
        />

        <Picker.Item
          label="Hallanamiento"
          value="Hallanamiento"
        />

        <Picker.Item
          label="Secuestro"
          value="Secuestro"
        />

        <Picker.Item
          label="Actividad sospechosa"
          value="Actividad sospechosa"
        />

        <Picker.Item
          label="Disparos de arma de fuego"
          value="Disparos de arma de fuego"
        />
      </Picker>

      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          width: 200,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 670,
        }}
        onPress={() => {
          if (!motivo) {
            alert('Seleccione un motivo');
            return;
          }

          alert(`Motivo seleccionado: ${motivo}`);
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color: 'black',
            fontSize: 22,
          }}
        >
          ENVIAR ALERTA
        </Text>
      </TouchableOpacity>
    </View>
  );
}