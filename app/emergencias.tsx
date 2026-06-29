import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmergenciaScreen() {
  const [contactoAgregado] = useState(false);
  const [accion, setAccion] = useState('');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#10172B',
        alignItems: 'center',
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
        <Text
          style={{
            color: 'white',
            fontSize: 30,
          }}
        >
          ←
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: 'white',
          fontSize: 32,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 50,
        }}
      >
        Añadir contacto{"\n"}de emergencia
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/contacto')}
      >
        <Text style={styles.buttonText}>
          Añadir
        </Text>
      </TouchableOpacity>

      {contactoAgregado && (
        <Text
          style={{
            color: 'white',
            fontSize: 11,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          ¡Su contacto ha sido añadido{"\n"}
          exitosamente!
        </Text>
      )}

      <View
          style={{
            backgroundColor: 'white',
            width: 250,
            alignSelf: 'center',
            marginTop: 20,
          }}
        >
          <Picker
            selectedValue={accion}
            onValueChange={(itemValue) => setAccion(itemValue)}
          >
            <Picker.Item
              label="Acciones"
              value=""
            />

            <Picker.Item
              label="Enviar notificación"
              value="notificacion"
            />

            <Picker.Item
              label="Enviar Whatsapp"
              value="whatsapp"
            />

            <Picker.Item
              label="Hacer vibrar teléfono"
              value="vibrar"
            />
          </Picker>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F0F0F2',
    width: 170,
    height: 55,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 180,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#10172B',
  },
});