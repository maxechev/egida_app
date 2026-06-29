import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function alertaopcScreen() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <View
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
          alignSelf: 'center',
          marginTop: 50,
          textAlign: 'center',
        }}
      >
        Configuración{"\n"}de alertas
      </Text>

      <View
        style={{
          marginTop: 160,
          gap: 25,
        }}
      >
        <TouchableOpacity style={styles.button}
        onPress={() => router.push('/gestos')}
        >
          <Text style={styles.text}>
            Gestos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}
          onPress={() => router.push('/config-notificaciones')}
          >
            Notificaciones
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>
            Sonidos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>
            Contactos de emergencia
          </Text>
        </TouchableOpacity>
      </View>

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
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    textAlign: 'center' as const,
    color: '#10172B',
    fontSize: 20,
  },
};