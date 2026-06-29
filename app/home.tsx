import * as Location from 'expo-location';
import { router } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from './firebase/config'; // Asegúrate de que la ruta sea correcta

// Estilos oscuros para el mapa (Identidad Égida)
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F172A' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#172554' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export default function HomeScreen() {
  const [region, setRegion] = useState<any>(null);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef<MapView>(null);
  const usuariosCache = useRef<Record<string, any>>({}); // Caché local para evitar lecturas duplicadas

  // 1. Inicializar ubicación del usuario
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitamos tu ubicación para mostrar alertas cercanas.');
          // Fallback a Resistencia si no hay permiso
          setRegion({ latitude: -27.4514, longitude: -58.9867, latitudeDelta: 0.05, longitudeDelta: 0.05 });
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
      }
    })();
  }, []);

  // 2. Suscripción en tiempo real a alertas + Resolución de nombres
  useEffect(() => {
    if (!region) return;

    const q = query(
      collection(db, 'alertas_demo'),
      where('estado', '==', 'En proceso'),
      where('redId', '==', 'barrio-demo-1'), // Filtrado por red (Métrico de éxito)
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const nuevasAlertas = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        
        // LECTURA DOBLE OPTIMIZADA: Solo si no está en caché
        if (!usuariosCache.current[data.userId]) {
          try {
            const userDoc = await getDoc(doc(db, 'usuarios', data.userId));
            usuariosCache.current[data.userId] = userDoc.exists() 
              ? userDoc.data() 
              : { displayName: 'Vecino Anónimo', photoURL: null };
          } catch (e) {
            usuariosCache.current[data.userId] = { displayName: 'Usuario Desconocido' };
          }
        }

        return {
          id: docSnap.id,
          ...data,
          usuarioInfo: usuariosCache.current[data.userId],
          timestamp: data.timestamp?.toDate() || new Date()
        };
      }));

      setAlertas(nuevasAlertas);
      setLoading(false);
    }, (error) => {
      console.error('Error en suscripción de alertas:', error);
      Alert.alert('Error', 'No se pudieron cargar las alertas de la red.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [region]);

  const centerOnUser = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Error centrando mapa:', error);
    }
  };

  if (!region || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4444" />
        <Text style={styles.loadingText}>Conectando con la red Égida...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* MAPA DE FONDO */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        customMapStyle={darkMapStyle}
      >
        {alertas.map((alerta) => (
          <Marker
            key={alerta.id}
            coordinate={{ 
              latitude: alerta.ubicacion.lat, 
              longitude: alerta.ubicacion.lng 
            }}
            pinColor="#FF4444"
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>⚠️ ALERTA ACTIVA</Text>
                
                <View style={styles.row}>
                  <Text style={styles.label}>USUARIO</Text>
                  <Text style={styles.value}>{alerta.usuarioInfo.displayName}</Text>
                </View>
                
                <View style={styles.row}>
                  <Text style={styles.label}>MOTIVO</Text>
                  <Text style={styles.value}>{alerta.motivo}</Text>
                </View>
                
                <View style={styles.row}>
                  <Text style={styles.label}>HORA</Text>
                  <Text style={styles.value}>
                    {alerta.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                
                <Text style={styles.estadoBadge}>● En proceso</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* CONTROLES SUPERIORES */}
      <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/opciones')}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.redBadge}>
        <Text style={styles.redText}>Red actual: Barrio Demo</Text>
      </View>

      <View style={styles.rightControls}>
        <TouchableOpacity><Text style={styles.controlIcon}>🌐</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.controlIcon}>⌕</Text></TouchableOpacity>
        <TouchableOpacity onPress={centerOnUser}><Text style={styles.controlIcon}>◎</Text></TouchableOpacity>
      </View>

      {/* BOTÓN ENVIAR ALERTA (Estilo DiDi/Égida) */}
      <TouchableOpacity 
        style={styles.sendAlertBtn}
        onPress={() => router.push('/alerta')}
      >
        <Text style={styles.sendAlertText}>ENVIAR ALERTA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  map: { ...StyleSheet.absoluteFillObject },
  loadingContainer: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94A3B8', marginTop: 15, fontSize: 16 },
  
  // Controles superiores
  menuBtn: { position: 'absolute', top: 60, left: 20, backgroundColor: '#FFF', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  menuIcon: { fontSize: 24 },
  redBadge: { position: 'absolute', top: 60, alignSelf: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, zIndex: 10 },
  redText: { color: '#0F172A', fontWeight: 'bold', fontSize: 13 },
  rightControls: { position: 'absolute', top: 60, right: 20, gap: 20, zIndex: 10 },
  controlIcon: { color: '#FFF', fontSize: 30, marginLeft: 30, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },

  // Callout (Popup de detalles)
  callout: { width: 240, backgroundColor: '#0B1325', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#1E293B' },
  calloutTitle: { color: '#FF4444', fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#1E293B', paddingBottom: 6 },
  label: { color: '#A0AABF', fontSize: 11, fontWeight: '600' },
  value: { color: '#FFF', fontSize: 13, maxWidth: 140, textAlign: 'right' },
  estadoBadge: { color: '#FF4444', fontWeight: 'bold', marginTop: 10, textAlign: 'center', fontSize: 13 },

  // Botón enviar alerta
  sendAlertBtn: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    backgroundColor: '#FF4444', width: 220, height: 60,
    justifyContent: 'center', alignItems: 'center', borderRadius: 12, zIndex: 10,
    shadowColor: "#FF4444", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8
  },
  sendAlertText: { color: '#000', fontWeight: 'bold', fontSize: 22 }
});