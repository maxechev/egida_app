import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GestosScreen() {
  const [gestos, setGestos] = useState(true);
  const [quickSettings, setQuickSettings] = useState(true);

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
        }}
      >
        Gestos
      </Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          ATENCIÓN: si desactivás esta opción,
          los gestos rápidos para enviar una
          alerta ya no funcionarán.
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>
            Activar/Desactivar gestos
          </Text>

          <Switch
            value={gestos}
            onValueChange={setGestos}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.description}>
          Añade una opción en la barra de Quick
          Settings para activar/desactivar el
          modo de alertas con gestos.
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>
            Botón en Quick Settings
          </Text>

          <Switch
            value={quickSettings}
            onValueChange={setQuickSettings}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/config-gestos')}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Configuración de gestos
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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

  button: {
    backgroundColor: '#F0F0F2',
    width: 220,
    height: 45,
    alignSelf: 'center' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 40,
  },
};