import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmailVerifiedScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#10172B',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        ✓ Correo verificado
      </Text>

      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: 30,
        }}
      >
        Tu cuenta fue verificada correctamente.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#F0F0F2',
          width: 150,
          height: 45,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => router.replace('/login')}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Continuar
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}