import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfigSonidosScreen() {
  const [recibir, setRecibir] = useState(true);
  const [repeticion, setRepeticion] = useState(true);
  const [alerta, setAlerta] = useState('');

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
          textAlign: 'center',
        }}
      >
        Configuración{"\n"}de sonidos
      </Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivas esta opción, seguirás recibiendo 
          notificaciones solo que el teléfono ya no emitirá ningún
          sonido al mostrarlo        
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>
            Activar/Desactivar
          </Text>

          <Switch
            value={recibir}
            onValueChange={setRecibir}
          />
        </View>
      </View>

      <View style={styles.card}>
                    <Text style={styles.title}>Vibración</Text>
            
                    <Text style={styles.description}>
                      Atención: si desactivas esta opción, seguirás recibiendo notificaciones solo que sin que el teléfono vibre al mostrarlo
                    </Text>
            
                    <View style={styles.row}>
                      <Text style={styles.switchText}>
                        Activar/Desactivar
                      </Text>
            
                      <Switch
                        value={repeticion}
                        onValueChange={setRepeticion}
                      />
                    </View>
                  </View>

      <View
        style={{
          backgroundColor: 'white',
          width: 250,
          alignSelf: 'center',
          marginTop: 20,
        }}
      >
        <Picker
          selectedValue={alerta}
          onValueChange={(itemValue) =>
            setAlerta(itemValue)
          }
        >
          <Picker.Item
            label="Tipo de alerta rápida"
            value=""
          />

          <Picker.Item label="Sirena" value="Sirena" />
          <Picker.Item label="Alarma de android" value="Alarma de android" />
          <Picker.Item label="Sonido 3" value="Sonido 3" />
          <Picker.Item label="Sonido 4" value="Sonido 4" />
          <Picker.Item label="Sonido 5" value="Sonido 5" />
          <Picker.Item label="Sonido 6" value="Sonido 6" />
        </Picker>
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

  switchText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },

  section: {
    borderTopWidth: 1,
    borderColor: '#666',
    padding: 20,
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
  lista: {
  backgroundColor: 'white',
  width: 250,
  alignSelf: 'center' as const,
  marginTop: 20 as const,
},

item: {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 10 as const,
  paddingVertical: 10 as const,
  borderBottomWidth: 1 as const,
  borderColor: '#ddd' as const,
},

itemText: {
  color: '#333' as const,
  fontSize: 14 as const,
  width: 190 as const,
},
};