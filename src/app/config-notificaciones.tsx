import { View, Text, TouchableOpacity, Switch, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function ConfiNotificacionesScreen() {
  const [Notificaciones, setNotificaciones] = useState(true);
  const [vibracion, setVibracion] = useState(true);
  const [alertas, setAlertas] = useState<string[]>([]);
  const [mostrarLista, setMostrarLista] = useState(false);

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
        Configuración{"\n"}de gestos
      </Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivas esta opción, ya no recibirás notificaciones de alertas que hayan sido enviadas dentro de la app
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>
            Activar/Desactivar
          </Text>

          <Switch
            value={Notificaciones}
            onValueChange={setNotificaciones}
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
                  value={vibracion}
                  onValueChange={setVibracion}
                />
              </View>
            </View>
        <View style={styles.selector}>

            <Pressable
              style={styles.prioridad}
              onPress={() => setMostrarLista(!mostrarLista)}
            >
              <Text style={{ fontSize: 18, fontWeight:'bold' }}>
                Prioridad
              </Text>

              <View
                style={[
                  styles.arrow,
                  mostrarLista && styles.arrowUp
                ]}
              />

            </Pressable>


            {mostrarLista && (
              <View style={styles.lista}>

                {[
                  'Robo',
                  'Secuestro de vehículo',
                  'Hallanamiento',
                  'Secuestro',
                  'Actividad sospechosa',
                  'Disparos de arma de fuego',
                ].map((item) => (

                  <Pressable
                    key={item}
                    style={styles.item}
                    onPress={() => {
                      setAlertas((prev) =>
                        prev.includes(item)
                          ? prev.filter((x) => x !== item)
                          : [...prev, item]
                      );
                    }}
                  >

                    <Text style={styles.itemText}>
                      {item}
                    </Text>


                    <View
                      style={[
                        styles.checkbox,
                        alertas.includes(item) && styles.checked,
                      ]}
                    >
                      {alertas.includes(item) && (
                        <Text style={styles.check}>
                          ✓
                        </Text>
                      )}
                    </View>

                  </Pressable>

                ))}

              </View>
            )}

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

checkbox: {
  width: 16,
  height: 16,
  borderWidth: 2,
  borderColor: '#333',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
},

checked: {
  backgroundColor: '#26200F',
  borderColor: '#26200F',
},

check: {
  color: 'white',
  fontSize: 9,
  fontWeight: 'bold' as const,
},

selector: {
  backgroundColor: 'white',
  width: 250,
  alignSelf: 'center' as const,
  marginTop: 20,
},

prioridad: {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 25,
  height: 60,
},
arrow: {
  width: 10,
  height: 10,
  borderRightWidth: 2,
  borderBottomWidth: 2,
  borderColor: '#222',
  transform: [
    { rotate: '45deg' }
  ],
  marginRight: 5,
},

arrowUp: {
  transform: [
    { rotate: '225deg' }
  ],
},
};