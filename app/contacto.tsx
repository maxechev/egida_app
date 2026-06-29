import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactoScreen() {
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [correo, setCorreo] = useState('');

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

      <View
        style={{
          marginTop: 170,
          gap: 15,
        }}
      >
        <TextInput
          placeholder="Nombre:"
          placeholderTextColor="#000"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <TextInput
          placeholder="Número:"
          placeholderTextColor="#000"
          keyboardType="phone-pad"
          value={numero}
          onChangeText={setNumero}
          style={styles.input}
        />

        <TextInput
          placeholder="Correo: (opcional)"
          placeholderTextColor="#000"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!nombre || !numero) {
            alert('Complete nombre y número');
            return;
          }

          router.back();
        }}
      >
        <Text style={styles.buttonText}>
          Añadir
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    backgroundColor: '#F0F0F2',
    width: 170,
    height: 40,
    paddingHorizontal: 10,
    fontWeight: 'bold' as const,
  },

  button: {
    backgroundColor: '#F0F0F2',
    width: 120,
    height: 45,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 60,
  },

  buttonText: {
    fontWeight: 'bold' as const,
    color: '#10172B',
    fontSize: 18,
  },
};