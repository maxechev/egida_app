import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function ConfiNotificacionesScreen() {
  const [Notificaciones, setNotificaciones] = useState(true);
  const [vibracion, setVibracion] = useState(true);
  const [alerta, setAlerta] = useState('');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#10172B',
      }}
    >
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Text
        style={{
          color: 'white',
          fontSize: 32,
          fontWeight: 'bold',
          alignSelf: 'center',
          marginTop: 50,
          marginBottom: 30,
          textAlign: 'center',
        }}
      >
        Configuración{"\n"}de gestos
      </Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivas esta opción, ya no recibirás notificaciones de alertas que hayan sido enviadas dentro de la app
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>
            Activar/Desactivar
          </Text>

          <Switch
            value={Notificaciones}
            onValueChange={setNotificaciones}
          />
        </View>
      </View>

      <View style={styles.card}>
              <Text style={styles.title}>Vibración</Text>
      
              <Text style={styles.description}>
                Atención: si desactivas esta opción, seguirás recibiendo notificaciones solo que sin que el teléfono vibre al mostrarlo
              </Text>
      
              <View style={styles.row}>
                <Text style={styles.switchText}>
                  Activar/Desactivar
                </Text>
      
                <Switch
                  value={vibracion}
                  onValueChange={setVibracion}
                />
              </View>
            </View>

      <View
        style={{
          backgroundColor: 'white',
          width: 250,
          alignSelf: 'center',
          marginTop: 20,
        }}
      >
        <Picker
          selectedValue={alerta}
          onValueChange={(itemValue) =>
            setAlerta(itemValue)
          }
        >
          <Picker.Item
            label="Prioridad"
            value=""
          />

          <Picker.Item label="Robo" value="Robo" />
          <Picker.Item label="Secuestro de vehículo" value="Secuestro de vehículo" />
          <Picker.Item label="Hallanamiento" value="Hallanamiento" />
          <Picker.Item label="Secuestro" value="Secuestro" />
          <Picker.Item label="Actividad sospechosa" value="Actividad sospechosa" />
          <Picker.Item label="Disparos de arma de fuego" value="Disparos de arma de fuego" />
        </Picker>
      </View>
    </View>
  );
}

const styles = {
card: {
    borderTopWidth: 1,
    borderColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  switchText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },

  section: {
    borderTopWidth: 1,
    borderColor: '#666',
    padding: 20,
  },

  description: {
    color: 'white',
    fontSize: 11,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },

  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
};