import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OpcionesScreen() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);

      setMostrarModal(false);

      router.replace('/login');
    } catch (error) {
      alert('Error al cerrar sesión');
    }
  };

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
          left: 20,
          top: 50,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', fontSize: 30 }}>
          ←
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: 'white',
          fontSize: 32,
          fontWeight: 'bold',
          marginTop: 50,
        }}
      >
        Opciones
      </Text>

      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          top: 40,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => router.push('/perfil')}
      >
        <Text style={{ fontSize: 35 }}>
          👤
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 190,
          gap: 25,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/alertaopc')}
        >
          <Text style={styles.text}>
            Alertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>
            Historial
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>
            Comunidad
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>
            Chat de la red
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 80,
        }}
        onPress={() => setMostrarModal(true)}
      >
        <Text
          style={{
            color: 'red',
            fontWeight: 'bold',
          }}
        >
          Cerrar sesión
        </Text>
      </TouchableOpacity>

      <Modal
        visible={mostrarModal}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#10172B',
              width: 320,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: 'yellow',
                fontSize: 34,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Atención
            </Text>

            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                marginTop: 20,
                marginBottom: 25,
              }}
            >
              Al cerrar sesión deberá volver a
              iniciar sesión para acceder a su
              cuenta. ¿Desea continuar?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 15,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setMostrarModal(false)
                }
              >
                <Text
                  style={{
                    backgroundColor: 'white',
                    padding: 8,
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={cerrarSesion}
              >
                <Text
                  style={{
                    backgroundColor: 'white',
                    padding: 8,
                  }}
                >
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  button: {
    backgroundColor: '#F0F0F2',
    width: 170,
    height: 55,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  text: {
    fontWeight: 'bold' as const,
    color: '#10172B',
    fontSize: 20,
  },
};