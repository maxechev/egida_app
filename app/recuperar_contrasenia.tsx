import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const icon = require('../assets/images/logo_egida.png');

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#10172B',
        alignItems: 'center',
        paddingHorizontal: 30,
      }}
    >
      <StatusBar style="light" />

      {/* Flecha atrás */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>{'←'}</Text>
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={icon}
        style={{
          width: 140,
          height: 140,
          marginTop: 120,
          marginBottom: 10,
        }}
        resizeMode="contain"
      />

      {/* Título */}
      <Text
        style={{
          color: '#F0F0F2',
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        ÉGIDA
      </Text>

      {/* Subtítulo */}
      <Text
        style={{
          color: '#F0F0F2',
          fontSize: 18,
          marginBottom: 5,
        }}
      >
        Recuperar contraseña
      </Text>

      <Text
        style={{
          color: '#A0A0A0',
          fontSize: 14,
          marginBottom: 30,
        }}
      >
        Ingrese su nueva contraseña
      </Text>

      {/* Input contraseña */}
      <TextInput
        placeholder="Contraseña nueva"
        placeholderTextColor="#555"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: '#E5E5E5',
          width: '100%',
          height: 45,
          borderRadius: 4,
          paddingHorizontal: 10,
          marginBottom: 15,
        }}
      />

      {/* Input repetir */}
      <TextInput
        placeholder="Repetir contraseña"
        placeholderTextColor="#555"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        style={{
          backgroundColor: '#E5E5E5',
          width: '100%',
          height: 45,
          borderRadius: 4,
          paddingHorizontal: 10,
          marginBottom: 25,
        }}
      />

      {/* Botón */}
      <TouchableOpacity
        style={{
          backgroundColor: '#D9D9D9',
          width: 160,
          height: 45,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => alert('Confirmar')}
      >
        <Text
          style={{
            color: '#000',
            fontWeight: '600',
          }}
        >
          Confirmar
        </Text>
      </TouchableOpacity>
    </View>
  );
}