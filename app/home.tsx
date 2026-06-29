import { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#0F172A' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94A3B8' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0F172A' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1E293B' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748B' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#172554' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];

export default function HomeScreen() {
  const [region, setRegion] = useState<any>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Permiso de ubicación denegado');
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const centerOnUser = async () => {
  const location = await Location.getCurrentPositionAsync({});

  mapRef.current?.animateToRegion({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
};

  if (!region) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        customMapStyle={darkMapStyle}
        />

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          backgroundColor: 'red',
          width: 220,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}

        onPress={() => router.push('/alerta')}
      >
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 22,
          }}
        >
          ENVIAR ALERTA
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
            position: 'absolute',
            top: 60,
            left: 20,
            backgroundColor: 'white',
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
        }}

        onPress={() => router.push('/opciones')}

        >
        <Text style={{ fontSize: 24 }}>☰</Text>
        </TouchableOpacity>

        <View
        style={{
            position: 'absolute',
            top: 60,
            alignSelf: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 10,
        }}
        >
        <Text>Red actual: Barrio</Text>
        </View>

        <View
        style={{
            position: 'absolute',
            top: 60,
            right: 20,
            gap: 20,
        }}
        >
        <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 30, marginLeft: 30 }}>🌐</Text>
        </TouchableOpacity>

        <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 30, marginLeft: 40 }}>⌕</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={centerOnUser}>
            <Text style={{ color: 'white', fontSize: 30, marginLeft: 40 }}>◎</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}