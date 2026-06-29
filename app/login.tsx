import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/config';

const icon = require('../assets/images/logo_egida.png');

export default function HomeScreen() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const login = async () => {
  if (!email || !password) {
    alert('Complete correo y contraseña');
    return;
  }

  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    router.replace('/home');
  } catch (error: any) {
    switch (error.code) {
      case 'auth/invalid-credential':
        alert('Correo o contraseña incorrectos.');
        break;

      case 'auth/network-request-failed':
        alert('Sin conexión a Internet.');
        break;

      default:
        console.log(error);
        alert('Ocurrió un error al iniciar sesión.');
        break;
    }
  }
};

  return (    
    <View
      style={{
        flex: 1,
        backgroundColor: '#10172B',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image source={icon} style={{ width: 200, height:200, marginBottom: -20 }}/>
      <StatusBar style="light" /> 
      <Text style={{ color: '#F0F0F2', fontSize: 20 }}>
        Iniciar sesión
        </Text>

        <TextInput
        placeholder="Correo"
        placeholderTextColor="#000000"
        value={email}
        onChangeText={setEmail}
        style={{
            backgroundColor: '#F0F0F2',
            width: 250,
            height: 40,
            marginTop: 20,
            marginBottom: 15,
            paddingHorizontal: 10,
        }}
        />

        <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#000000"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
            backgroundColor: '#F0F0F2',
            width: 250,
            height: 40,
            marginBottom: 20,
            paddingHorizontal: 10,
        }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#F0F0F2',
            width: 130,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={login}
        >
          <Text
            style={{
              color: '#10172B',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#F0F0F2',
            width: 130,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
          onPress={() => router.push('/register')}
        >
          <Text
            style={{
              color: '#10172B',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Crear cuenta
          </Text>
        </TouchableOpacity>

    </View>
  );
}