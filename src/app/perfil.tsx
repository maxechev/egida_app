import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilScreen() {
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
        <Text
          style={{
            color: 'white',
            fontSize: 30,
          }}
        >
          ←
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 60,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#F0F0F2',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 70 }}>
          👤
        </Text>
      </View>

      <View
        style={{
          marginTop: 15,
          gap: 10,
        }}
      >
        <View style={styles.box}>
          <Text>José Matías</Text>
        </View>

        <View style={styles.box}>
          <Text>Martínez</Text>
        </View>

        <View style={styles.box}>
          <Text>josemarti@gmail.com</Text>
        </View>

        <View style={styles.box}>
          <Text>362-5472263</Text>
        </View>

        <View style={styles.box}>
          <Text>José</Text>
        </View>

        <TouchableOpacity
          style={{
            ...styles.box,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => router.push('/privacidad')}
        >
          <Text
            style={{
              fontWeight: 'bold',
            }}
          >
            Privacidad
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  box: {
    backgroundColor: '#F0F0F2',
    width: 180,
    height: 35,
    justifyContent: 'center' as const,
    paddingHorizontal: 10,
  },
};