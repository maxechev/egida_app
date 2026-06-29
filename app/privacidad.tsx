import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacidadScreen() {
  const [nombreVisible, setNombreVisible] = useState(true);
  const [ubicacionVisible, setUbicacionVisible] = useState(true);
  const [contactoVisible, setContactoVisible] = useState(true);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#10172B',
      }}
    >
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 20,
          top: 50,
          zIndex: 1,
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
          fontSize: 24,
          fontWeight: 'bold',
          alignSelf: 'center',
          marginTop: 70,
          marginBottom: 30,
        }}
      >
        Privacidad
      </Text>

      <View style={styles.card}>
        <Text style={styles.title}>Mostrar nombre</Text>

        <Text style={styles.description}>
          Atención: si desactivás esta opción,
          las demás personas no verán tu
          nombre real, solo tu alias.
        </Text>

        <View style={styles.row}>
          <Text style={styles.switchText}>
            Activar/Desactivar
          </Text>

          <Switch
            value={nombreVisible}
            onValueChange={setNombreVisible}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Ubicación</Text>

        <Text style={styles.description}>
          Atención: si desactivás esta opción,
          no podremos saber tu ubicación
          cuando estés en el mapa y/o cuando
          quieras enviar una alerta.
        </Text>

        <View style={styles.row}>
          <Text style={styles.switchText}>
            Activar/Desactivar
          </Text>

          <Switch
            value={ubicacionVisible}
            onValueChange={setUbicacionVisible}
          />
        </View>
      </View>


      <View style={styles.card}>
        <Text style={styles.title}>Contacto</Text>

        <Text style={styles.description}>
          Atención: si desactivás esta opción,
          las personas que sepan que mandaste
          alguna alarma no podrán
          contactarse contigo.
        </Text>

        <View style={styles.row}>
          <Text style={styles.switchText}>
            Activar/Desactivar
          </Text>

          <Switch
            value={contactoVisible}
            onValueChange={setContactoVisible}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  card: {
    borderTopWidth: 1,
    borderColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 5,
  },

  description: {
    color: 'white',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },

  switchText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
};