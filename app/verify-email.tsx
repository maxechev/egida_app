import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { auth } from './firebase/config';

const icon = require('../assets/images/logo_egida.png');

export default function VerifyEmailScreen() {

    const checkVerification = async () => {
        try {
            await auth.currentUser?.reload();

            if (auth.currentUser?.emailVerified) {
            router.replace('/email-verified');
            } else {
            alert('Todavía no verificaste tu correo');
            }
        } catch (error) {
            alert('Error al verificar el estado del correo');
        }
};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#10172B',
        alignItems: 'center',
        paddingTop: 50,
      }}
    >
      <StatusBar style="light" />

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

      <Image
        source={icon}
        style={{
          width: 180,
          height: 180,
          marginTop: 40,
        }}
      />

      <Text
        style={{
          color: '#F0F0F2',
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 30,
        }}
      >
        Confirmar correo
      </Text>


      <Text
        style={{
            color: '#F0F0F2',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 30,
        }}
        >
        Te enviamos un correo de verificación.{'\n'}
        Revisá tu bandeja de entrada y{'\n'}
        hacé clic en el enlace recibido.
        </Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#F0F0F2',
          width: 170,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}
        onPress={checkVerification}
      >
        <Text
          style={{
            color: '#10172B',
            fontWeight: 'bold',
          }}
        >
          Ya verifiqué mi correo
        </Text>
      </TouchableOpacity>
    </View>
  );
}