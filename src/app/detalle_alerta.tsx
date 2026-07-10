import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from './firebase/config';

export default function DetalleAlertaScreen() {
  const { id } = useLocalSearchParams();
  const [alerta, setAlerta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'alertas_demo', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Resolver usuario si es necesario (aquí simplificado)
          setAlerta({
            id: docSnap.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(),
            userName: data.usuarioInfo?.displayName || 'Usuario Anónimo'
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchDetalle();
  }, [id]);

  if (loading || !alerta) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  const isActiva = alerta.estado === 'En proceso';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Detalles de alerta</Text>
      </View>

      <View style={styles.card}>
        {/* Usuario */}
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="person-outline" size={20} color="#94A3B8" /></View>
          <View>
            <Text style={styles.label}>USUARIO</Text>
            <Text style={styles.value}>{alerta.userName}</Text>
          </View>
        </View>

        {/* Motivo */}
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="warning-outline" size={20} color="#94A3B8" /></View>
          <View>
            <Text style={styles.label}>MOTIVO</Text>
            <Text style={styles.value}>{alerta.motivo}</Text>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="location-outline" size={20} color="#94A3B8" /></View>
          <View>
            <Text style={styles.label}>UBICACIÓN</Text>
            <Text style={styles.value}>{alerta.ubicacionTexto}</Text>
          </View>
        </View>

        {/* Hora */}
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="time-outline" size={20} color="#94A3B8" /></View>
          <View>
            <Text style={styles.label}>HORA</Text>
            <Text style={styles.value}>
              {alerta.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        {/* Estado */}
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="information-circle-outline" size={20} color="#94A3B8" /></View>
          <View>
            <Text style={styles.label}>ESTADO</Text>
            <View style={[styles.badge, { backgroundColor: isActiva ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.15)' }]}>
              <Text style={[styles.badgeText, { color: isActiva ? '#EF4444' : '#94A3B8' }]}>
                ● {alerta.estado}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1325' },
  loadingContainer: { flex: 1, backgroundColor: '#0B1325', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60 },
  backBtn: { color: '#FFF', fontSize: 24, marginRight: 15 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  
  card: { marginHorizontal: 20, backgroundColor: '#111C33', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E293B' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  
  label: { color: '#64748B', fontSize: 11, fontWeight: '700', marginBottom: 4, letterSpacing: 0.5 },
  value: { color: '#F1F5F9', fontSize: 16, fontWeight: '500' },
  
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginTop: 4 },
  badgeText: { fontSize: 13, fontWeight: '700' }
});