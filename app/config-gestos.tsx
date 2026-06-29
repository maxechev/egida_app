import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function ConfigGestosScreen() {
  const [apagado, setApagado] = useState(true);
  const [confirmacion, setConfirmacion] = useState(true);
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
          Al apretar 3 veces seguidas el botón de apagado, el teléfono entrará en modo de alertas, y dependiendo de cuantas veces se apriete el botón de subir volumen, enviará un tipo de alerta.
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>
            Botón de apagado
          </Text>

          <Switch
            value={apagado}
            onValueChange={setApagado}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.description}>
          Cuando hagas un gesto de alerta, la alerta será configurada automáticamente y luego enviada con el tipo de alerta elegido en las configuraciones.
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>
            Confirmación rápida
          </Text>

          <Switch
            value={confirmacion}
            onValueChange={setConfirmacion}
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
            label="Tipo de alerta rápida"
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
  section: {
    borderTopWidth: 1,
    borderColor: '#666',
    padding: 12,
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