import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AlertaDetalleCardProps {
  motivo: string;
  userName: string;
  hora: string;
  ubicacionTexto?: string; // Opcional: Si tienes geocodificación inversa
}

export default function AlertaDetalleCard({ 
  motivo, 
  userName, 
  hora, 
  ubicacionTexto = 'Ubicación exacta en mapa' 
}: AlertaDetalleCardProps) {
  return (
    <View style={styles.container}>
      {/* Encabezado con ícono de advertencia */}
      <View style={styles.header}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>ALERTA ACTIVA</Text>
      </View>

      {/* Filas de información */}
      <View style={styles.row}>
        <Text style={styles.label}>USUARIO</Text>
        <Text style={styles.value}>{userName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>MOTIVO</Text>
        <Text style={styles.value}>{motivo}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>UBICACIÓN</Text>
        <Text style={styles.value}>{ubicacionTexto}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>HORA</Text>
        <Text style={styles.value}>{hora}</Text>
      </View>

      {/* Estado destacado */}
      <View style={styles.statusRow}>
        <Text style={styles.label}>ESTADO</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>● En proceso</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: '#0B1325',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  icon: { fontSize: 20 },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  label: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '500',
    maxWidth: 150,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});