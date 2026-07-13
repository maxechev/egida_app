import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://192.168.1.10:5285/api";

interface Red {
  id: number;
  nombre: string;
  tipoRed: string;
}

export default function RedesScreen() {
  const [redes, setRedes] = useState<Red[]>([]);
  const [redActivaId, setRedActivaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [redSeleccionada, setRedSeleccionada] = useState<Red | null>(null);

  useEffect(() => {
    cargarRedes();
  }, []);

  const cargarRedes = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/Red/mis-redes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRedes(data);

        // Obtener red activa guardada
        const redActiva = await SecureStore.getItemAsync("redActivaId");
        if (redActiva) {
          setRedActivaId(parseInt(redActiva));
        } else if (data.length > 0) {
          // Si no hay red activa, usar la primera
          setRedActivaId(data[0].id);
          await SecureStore.setItemAsync("redActivaId", data[0].id.toString());
        }
      }
    } catch (error) {
      console.error("Error al cargar redes:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarCambioRed = (red: Red) => {
    setRedSeleccionada(red);
  };

  const cambiarRed = async () => {
    if (!redSeleccionada) return;

    try {
      await SecureStore.setItemAsync(
        "redActivaId",
        redSeleccionada.id.toString(),
      );
      setRedActivaId(redSeleccionada.id);
      setRedSeleccionada(null);

      Alert.alert("Éxito", `Red cambiada a: ${redSeleccionada.nombre}`);
      router.replace("/home");
    } catch (error) {
      console.error("Error al cambiar red:", error);
      Alert.alert("Error", "No se pudo cambiar la red");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4444" />
        <Text style={styles.loadingText}>Cargando redes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redes</Text>
      </View>

      <View style={styles.list}>
        {redes.map((red) => (
          <View key={red.id} style={styles.redItem}>
            <View style={styles.redInfo}>
              <Text style={styles.redNombre}>
                {red.nombre.length > 20
                  ? red.nombre.substring(0, 20) + "..."
                  : red.nombre}
              </Text>
              <Text style={styles.redTipo}>{red.tipoRed}</Text>
            </View>

            {redActivaId === red.id ? (
              <View style={styles.badgeActual}>
                <Text style={styles.badgeText}>Actual</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.btnCambiar}
                onPress={() => confirmarCambioRed(red)}
              >
                <Text style={styles.btnCambiarText}>Cambiar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Modal de confirmación */}
      <Modal visible={!!redSeleccionada} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setRedSeleccionada(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atención</Text>
            <Text style={styles.modalText}>
              Está a punto de cambiar de red. Verifique que desea continuar.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setRedSeleccionada(null)}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAceptar} onPress={cambiarRed}>
                <Text style={styles.btnAceptarText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10172B",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#10172B",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 15,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backIcon: {
    color: "white",
    fontSize: 30,
    marginRight: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
  redItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F2",
    borderRadius: 12,
    padding: 15,
  },
  redInfo: {
    flex: 1,
  },
  redNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10172B",
    marginBottom: 5,
  },
  redTipo: {
    fontSize: 12,
    color: "#666",
  },
  badgeActual: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  btnCambiar: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnCambiarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 25,
    width: "85%",
    maxWidth: 350,
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#334155",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCancelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  btnAceptar: {
    flex: 1,
    backgroundColor: "#FF4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAceptarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
