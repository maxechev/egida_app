import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { API_URL } from '../constants/urlApi';

interface AlertaHistorial {
  id: string;
  motivo: string;
  direccion: string;
  timestamp: Date;
  estado: string;
  userName: string;
}

export default function HistorialAlertasScreen() {
  const [alertas, setAlertas] = useState<AlertaHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"Todas" | "En proceso" | "Finalizado">(
    "Todas",
  );

  useEffect(() => {
    cargarAlertas();
  }, [filtro]);

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const redActiva = await SecureStore.getItemAsync("redActivaId");

      if (!token || !redActiva) return;

      // Construir URL con filtro de red y estado
      let url = `${API_URL}/Alerta?redId=${redActiva}`;
      if (filtro !== "Todas") {
        url += `&estado=${encodeURIComponent(filtro)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error al cargar alertas:", response.status);
        return;
      }

      const data = await response.json();

      // Resolver nombres de usuarios en paralelo
      const promesas = data.map(async (alerta: any) => {
        let userName = "Usuario Anónimo";
        if (alerta.usuarioId) {
          try {
            const userResponse = await fetch(
              `${API_URL}/Usuario/${alerta.usuarioId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            if (userResponse.ok) {
              const userData = await userResponse.json();
              userName = `${userData.nombre} ${userData.apellido}`;
            }
          } catch (e) {
            console.error("Error resolviendo usuario:", e);
          }
        }

        return {
          id: alerta.id.toString(),
          motivo: alerta.tipo,
          direccion: alerta.ubicacion || "Dirección no disponible",
          timestamp: new Date(alerta.fecha),
          estado: alerta.estado || "Desconocido",
          userName: userName,
        } as AlertaHistorial;
      });

      const lista = await Promise.all(promesas);
      setAlertas(lista);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: AlertaHistorial }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({ pathname: "/detalle_alerta", params: { id: item.id } })
      }
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor:
              item.estado === "En proceso" ? "#EF4444" : "#64748B",
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.hora}>
          {item.timestamp.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text style={styles.ubicacion} numberOfLines={1}>
          {item.direccion}
        </Text>
        <Text
          style={[
            styles.motivo,
            {
              color: item.estado === "En proceso" ? "#EF4444" : "#94A3B8",
              fontSize: 12,
            },
          ]}
        >
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Historial de alertas</Text>
      </View>

      <View style={styles.filtros}>
        {["Todas", "En proceso", "Finalizado"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, filtro === f && styles.filtroActivo]}
            onPress={() => setFiltro(f as any)}
          >
            <Text
              style={[styles.filtroTxt, filtro === f && styles.filtroTxtActivo]}
            >
              {f}
            </Text>
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
  container: { flex: 1, backgroundColor: "#0B1325" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B1325",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  backBtn: { color: "#FFF", fontSize: 24, marginRight: 15 },
  title: { color: "#FFF", fontSize: 22, fontWeight: "bold" },

  filtros: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filtroBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1E293B",
  },
  filtroActivo: { backgroundColor: "#EF4444" },
  filtroTxt: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
  filtroTxtActivo: { color: "#FFF" },

  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    backgroundColor: "#111C33",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  indicator: { width: 6, backgroundColor: "#EF4444" },
  content: { flex: 1, padding: 16 },
  hora: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  ubicacion: { color: "#94A3B8", fontSize: 14, marginBottom: 6 },
  motivo: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
