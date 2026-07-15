import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../constants/urlApi";

interface AlertaHistorial {
  id: string;
  motivo: string;
  direccion: string;
  timestamp: Date;
  estado: string;
  userName: string;
  usuarioId: number;
}

export default function HistorialAlertasScreen() {
  const [alertas, setAlertas] = useState<AlertaHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [miUsuarioId, setMiUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const obtenerMiId = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const id = parseInt(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        );
        setMiUsuarioId(id);
      }
    };

    obtenerMiId();
    cargarAlertas();
  }, []);

  const eliminarAlerta = async (id: number) => {
    Alert.alert(
      "Eliminar Alerta",
      "¿Estás seguro de que quieres borrar esta alerta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync("token");
              const response = await fetch(`${API_URL}/Alerta/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.ok) {
                cargarAlertas();
              } else {
                const data = await response.json();
                Alert.alert("Error", data.mensaje || "No se pudo eliminar");
              }
            } catch (error: any) {
              console.error("Error detallado al eliminar:", error);
              Alert.alert(
                "Error",
                error.message || "Fallo de conexión al eliminar",
              );
            }
          },
        },
      ],
    );
  };

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const redActiva = await SecureStore.getItemAsync("redActivaId");

      if (!token || !redActiva) return;

      // ✅ URL simplificada: solo filtramos por red activa
      const url = `${API_URL}/Alerta?redId=${redActiva}`;

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

      const promesas = data.map(async (alerta: any) => {
        let userName = "Usuario Anónimo";
        if (alerta.usuarioId) {
          try {
            const userResponse = await fetch(
              `${API_URL}/Usuario/${alerta.usuarioId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.nombre) {
                userName = `${userData.nombre} ${userData.apellido}`;
              } else if (userData.alias) {
                userName = userData.alias;
              }
            }
          } catch (e) {
            console.error("Error resolviendo usuario:", e);
          }
        }

        const fechaString = alerta.fecha.endsWith("Z")
          ? alerta.fecha
          : alerta.fecha + "Z";

        return {
          id: alerta.id.toString(),
          motivo: alerta.tipo,
          direccion: alerta.ubicacion || "Dirección no disponible",
          timestamp: new Date(fechaString),
          estado: alerta.estado || "Desconocido",
          userName: userName,
          usuarioId: alerta.usuarioId,
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

  const renderItem = ({ item }: { item: AlertaHistorial }) => {
    const esMia = item.usuarioId === miUsuarioId;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({ pathname: "/detalle_alerta", params: { id: item.id } })
        }
      >
        {/* ✅ Indicador de color fijo (rojo de alerta) */}
        <View style={[styles.indicator, { backgroundColor: "#EF4444" }]} />

        <View style={styles.content}>
          <View style={styles.rowHeader}>
            <Text style={styles.hora}>
              {item.timestamp.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {esMia && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  eliminarAlerta(Number(item.id));
                }}
                style={styles.btnEliminar}
              >
                <Ionicons name="trash-outline" size={20} color="#FF4444" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.ubicacion} numberOfLines={1}>
            {item.direccion}
          </Text>
          <Text style={styles.motivo}>
            {item.motivo} • {item.userName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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

      {/* ✅ Se eliminó la barra de filtros */}

      <FlatList
        data={alertas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay alertas registradas en esta red.
          </Text>
        }
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

  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  btnEliminar: {
    padding: 4,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    borderRadius: 6,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#111C33",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  indicator: { width: 6 }, // ✅ El color se define inline
  content: { flex: 1, padding: 16 },
  hora: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  ubicacion: { color: "#94A3B8", fontSize: 14, marginBottom: 6 },
  motivo: {
    color: "#EF4444", // ✅ Color fijo de alerta
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
