import { API_URL } from "@/src/constants/urlApi";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmergenciaScreen() {
  const [contactos, setContactos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [nombre, setNombre] = useState("");
  const [aliasUsuario, setAliasUsuario] = useState("");
  const [accion, setAccion] = useState("notificacion");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarContactos();
  }, []);

  const cargarContactos = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/ContactoEmergencia`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setContactos(data);
      }
    } catch (error) {
      console.error("Error al cargar contactos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = async () => {
    if (!nombre || !aliasUsuario) {
      Alert.alert("Error", "Nombre y alias son obligatorios.");
      return;
    }

    setGuardando(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(`${API_URL}/ContactoEmergencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, aliasUsuario, accion }),
      });

      if (response.ok) {
        setModalVisible(false);
        setNombre("");
        setAliasUsuario("");
        setAccion("notificacion");
        cargarContactos();
      } else {
        Alert.alert("Error", "No se pudo guardar el contacto.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Fallo de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este contacto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync("token");
            await fetch(`${API_URL}/ContactoEmergencia/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            cargarContactos();
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.contactoCard}>
      <View style={styles.avatarSmall}>
        <Ionicons name="person" size={24} color="white" />
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.aliasUsuario}>{item.aliasUsuario}</Text>
        <Text style={styles.accionText}>
          Acción:{" "}
          {item.accion === "whatsapp"
            ? "Enviar mensaje 📱"
            : item.accion === "notificacion"
              ? "Notificación Push 🔔"
              : "Hacer vibrar 📳"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btnEliminar}
        onPress={() => handleEliminar(item.id)}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4444" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contactos de Emergencia</Text>
      </View>

      <FlatList
        data={contactos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay contactos de emergencia agregados.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.btnAddText}>Añadir Contacto</Text>
      </TouchableOpacity>

      {/* Modal para agregar contacto */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Contacto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#94A3B8"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Alias del usuario (ej: lucasf)"
              placeholderTextColor="#94A3B8"
              value={aliasUsuario}
              onChangeText={setAliasUsuario}
              autoCapitalize="none"
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={accion}
                onValueChange={(itemValue) => setAccion(itemValue)}
                style={{ color: "#94A3B8" }}
              >
                <Picker.Item
                  label="Enviar Notificación Push"
                  value="notificacion"
                  color="black"
                />
                <Picker.Item
                  label="Enviar mensaje"
                  value="whatsapp"
                  color="black"
                />
                <Picker.Item
                  label="Hacer vibrar teléfono"
                  value="vibrar"
                  color="black"
                />
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSave}
                onPress={handleAgregar}
                disabled={guardando}
              >
                {guardando ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.btnSaveText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#10172B" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#10172B",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backIcon: { color: "white", fontSize: 30, marginRight: 15 },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  contactoCard: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  avatarSmall: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  info: { flex: 1 },
  nombre: { color: "white", fontSize: 16, fontWeight: "bold" },
  aliasUsuario: { color: "#94A3B8", fontSize: 14, marginTop: 2 },
  accionText: {
    color: "#4ADE80",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },

  actions: { flexDirection: "row", gap: 10 },
  btnAccion: { backgroundColor: "#4ADE80", padding: 10, borderRadius: 8 },
  btnEliminar: { backgroundColor: "#FF4444", padding: 10, borderRadius: 8 },

  btnAdd: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#FF4444",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  btnAddText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1E293B",
    width: "100%",
    maxWidth: 350,
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#0F172A",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCancelText: { color: "white", fontWeight: "bold" },
  btnSave: {
    flex: 1,
    backgroundColor: "#FF4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnSaveText: { color: "white", fontWeight: "bold" },
});
