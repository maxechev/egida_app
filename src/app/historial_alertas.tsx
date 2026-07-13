import { router } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore'; // ✅ Agregado getDoc y doc
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase/config';

interface AlertaHistorial {
  id: string;
  motivo: string;
  direccion: string;
  timestamp: Date;
  estado: string;
  userName: string; // ✅ Nuevo campo para mostrar nombre real
}

export default function HistorialAlertasScreen() {
  const [alertas, setAlertas] = useState<AlertaHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'Todas' | 'En proceso' | 'Finalizado'>('Todas');

  useEffect(() => {
    let q = query(collection(db, 'alertas_demo'), orderBy('timestamp', 'desc'));

    if (filtro !== 'Todas') {
      q = query(
        collection(db, 'alertas_demo'),
        where('estado', '==', filtro),
        orderBy('timestamp', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      // ✅ Procesamos en paralelo para resolver usuarios sin bloquear UI
      const promesas = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        
        // Resolver nombre de usuario desde /usuarios/{userId}
        let userName = 'Usuario Anónimo';
        if (data.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'usuarios', data.userId));
            if (userDoc.exists()) {
              userName = userDoc.data().displayName || 'Vecino Sin Nombre';
            }
          } catch (e) { 
            console.error('Error resolviendo usuario:', e); 
          }
        }

        return {
          id: docSnap.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          direccion: data.direccion || 'Dirección no disponible',
          estado: data.estado || 'Desconocido',
          userName: userName // ✅ Asignamos nombre resuelto
        } as AlertaHistorial;
      });

      const lista = await Promise.all(promesas);
      setAlertas(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filtro]);

  const renderItem = ({ item }: { item: AlertaHistorial }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/detalle_alerta', params: { id: item.id } })}
    >
      <View style={[styles.indicator, { backgroundColor: item.estado === 'En proceso' ? '#EF4444' : '#64748B' }]} />

      <View style={styles.content}>
        <Text style={styles.hora}>
          {item.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.ubicacion} numberOfLines={1}>{item.direccion}</Text>
        {/* ✅ Mostramos el nombre real del usuario */}
        <Text style={[styles.motivo, { color: item.estado === 'En proceso' ? '#EF4444' : '#94A3B8', fontSize: 12 }]}>
          {item.motivo} • {item.userName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Historial de alertas</Text>
      </View>

      <View style={styles.filtros}>
        {['Todas', 'En proceso', 'Finalizado'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, filtro === f && styles.filtroActivo]}
            onPress={() => setFiltro(f as any)}
          >
            <Text style={[styles.filtroTxt, filtro === f && styles.filtroTxtActivo]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={alertas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1325' },
  loadingContainer: { flex: 1, backgroundColor: '#0B1325', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60 },
  backBtn: { color: '#FFF', fontSize: 24, marginRight: 15 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },

  filtros: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
  filtroBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1E293B' },
  filtroActivo: { backgroundColor: '#EF4444' },
  filtroTxt: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  filtroTxtActivo: { color: '#FFF' },

  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#111C33',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  indicator: { width: 6, backgroundColor: '#EF4444' },
  content: { flex: 1, padding: 16 },
  hora: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  ubicacion: { color: '#94A3B8', fontSize: 14, marginBottom: 6 },
  motivo: { color: '#EF4444', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
});