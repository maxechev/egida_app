import * as Location from 'expo-location';
import { router } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import AlertaDetalleCard from '../components/alerta-detalle-card';
import { db } from './firebase/config';

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
  
  // ✅ NUEVO: Estado para controlar qué alerta mostrar en detalle
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<any>(null);
  
  const mapRef = useRef<MapView>(null);
  const usuariosCache = useRef<Record<string, any>>({});

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitamos tu ubicación para mostrar alertas cercanas.');
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
      } catch (error) { console.error(error); }
    })();
  }, []);

  useEffect(() => {
    if (!region) return;
    const q = query(
      collection(db, 'alertas_demo'),
      where('estado', '==', 'En proceso'),
      where('redId', '==', 'barrio-demo-1'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const nuevasAlertas = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        if (!usuariosCache.current[data.userId]) {
          try {
            const userDoc = await getDoc(doc(db, 'usuarios', data.userId));
            usuariosCache.current[data.userId] = userDoc.exists() ? userDoc.data() : { displayName: 'Vecino Anónimo' };
          } catch (e) { usuariosCache.current[data.userId] = { displayName: 'Usuario Desconocido' }; }
        }
        let fechaAlerta = new Date();
        if (data.timestamp && typeof data.timestamp.toDate === 'function') fechaAlerta = data.timestamp.toDate();
        else if (typeof data.timestamp === 'string') fechaAlerta = new Date(data.timestamp);
        
        return { id: docSnap.id, ...data, usuarioInfo: usuariosCache.current[data.userId], timestamp: fechaAlerta };
      }));
      setAlertas(nuevasAlertas);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [region]);

  const centerOnUser = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({ ...loc.coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  };

  if (!region || loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FF4444" /><Text style={styles.loadingText}>Conectando con la red Égida...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView ref={mapRef} style={styles.map} region={region} showsUserLocation customMapStyle={darkMapStyle}>
        {alertas.map((alerta) => (
          <Marker
            key={alerta.id}
            coordinate={{ latitude: alerta.ubicacion.lat, longitude: alerta.ubicacion.lng }}
            pinColor="#FF4444"
            onPress={() => {
              // ✅ Al tocar, centramos mapa Y abrimos el overlay de detalle
              mapRef.current?.animateToRegion({ 
                latitude: alerta.ubicacion.lat, 
                longitude: alerta.ubicacion.lng, 
                latitudeDelta: 0.005, 
                longitudeDelta: 0.005 
              });
              setAlertaSeleccionada(alerta);
            }}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          />
        ))}
      </MapView>

      {/* ✅ OVERLAY DE DETALLE (Reemplazo seguro del Callout nativo) */}
      <Modal visible={!!alertaSeleccionada} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setAlertaSeleccionada(null)}>
          <Pressable style={styles.cardContainer} onPress={(e) => e.stopPropagation()}>
            {alertaSeleccionada && (
              <AlertaDetalleCard 
                motivo={alertaSeleccionada.motivo}
                userName={alertaSeleccionada.usuarioInfo.displayName}
                hora={alertaSeleccionada.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                ubicacionTexto={`${alertaSeleccionada.ubicacion.lat.toFixed(4)}, ${alertaSeleccionada.ubicacion.lng.toFixed(4)}`}
              />
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setAlertaSeleccionada(null)}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Controles Superiores */}
      <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/opciones')}><Text style={styles.menuIcon}>☰</Text></TouchableOpacity>
      <View style={styles.redBadge}><Text style={styles.redText}>Red actual: Barrio Demo</Text></View>
      <View style={styles.rightControls}>
        <TouchableOpacity><Text style={styles.controlIcon}>🌐</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.controlIcon}>⌕</Text></TouchableOpacity>
        <TouchableOpacity onPress={centerOnUser}><Text style={styles.controlIcon}>◎</Text></TouchableOpacity>
      </View>

      {/* Botón Enviar Alerta */}
      <TouchableOpacity style={styles.sendAlertBtn} onPress={() => router.push('/alerta')}>
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
  
  // Estilos del Overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 100 },
  cardContainer: { width: '90%', maxWidth: 320, alignItems: 'center' },
  closeBtn: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 30, backgroundColor: '#1E293B', borderRadius: 20 },
  closeText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  menuBtn: { position: 'absolute', top: 60, left: 20, backgroundColor: '#FFF', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  menuIcon: { fontSize: 24 },
  redBadge: { position: 'absolute', top: 60, alignSelf: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, zIndex: 10 },
  redText: { color: '#0F172A', fontWeight: 'bold', fontSize: 13 },
  rightControls: { position: 'absolute', top: 60, right: 20, gap: 20, zIndex: 10 },
  controlIcon: { color: '#FFF', fontSize: 30, marginLeft: 30, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },

  sendAlertBtn: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    backgroundColor: '#FF4444', width: 220, height: 60,
    justifyContent: 'center', alignItems: 'center', borderRadius: 12, zIndex: 10,
    shadowColor: "#FF4444", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8
  },
  sendAlertText: { color: '#000', fontWeight: 'bold', fontSize: 22 }
});