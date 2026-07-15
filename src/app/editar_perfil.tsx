import { API_URL } from "@/src/constants/urlApi";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditarPerfilScreen() {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    correo: "", // Solo lectura
    contacto: "",
    ocupacion: "",
    alias: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/Perfil/mi-perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDatos({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          correo: data.correo || "",
          contacto: data.contacto || "",
          ocupacion: data.ocupacion || "",
          alias: data.alias || "",
        });
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      Alert.alert("Error", "No se pudieron cargar los datos del perfil.");
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    if (!datos.nombre || !datos.apellido || !datos.contacto || !datos.alias) {
      Alert.alert(
        "Error",
        "Nombre, Apellido, Contacto y Alias son obligatorios.",
      );
      return;
    }

    setGuardando(true);
    try {
      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(`${API_URL}/Perfil/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: datos.nombre,
          apellido: datos.apellido,
          contacto: datos.contacto,
          ocupacion: datos.ocupacion,
          alias: datos.alias,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Perfil actualizado correctamente.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", responseData.mensaje || "No se pudo actualizar.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "Fallo de conexión al guardar.");
    } finally {
      setGuardando(false);
    }
  };

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
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Alias *</Text>
        <TextInput
          style={styles.input}
          value={datos.alias}
          onChangeText={(text) => setDatos({ ...datos, alias: text })}
          placeholder="Tu alias único"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={datos.nombre}
          onChangeText={(text) => setDatos({ ...datos, nombre: text })}
          placeholder="Tu nombre"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Apellido *</Text>
        <TextInput
          style={styles.input}
          value={datos.apellido}
          onChangeText={(text) => setDatos({ ...datos, apellido: text })}
          placeholder="Tu apellido"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={datos.correo}
          editable={false}
        />
        <Text style={styles.hint}>
          El correo no se puede cambiar desde aquí.
        </Text>

        <Text style={styles.label}>Teléfono / Contacto *</Text>
        <TextInput
          style={styles.input}
          value={datos.contacto}
          onChangeText={(text) => setDatos({ ...datos, contacto: text })}
          placeholder="Ej: 3624123456"
          keyboardType="phone-pad"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Ocupación</Text>
        <TextInput
          style={styles.input}
          value={datos.ocupacion}
          onChangeText={(text) => setDatos({ ...datos, ocupacion: text })}
          placeholder="Ej: Estudiante, Ingeniero, etc."
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity
          style={[styles.btnSave, guardando && styles.btnSaveDisabled]}
          onPress={guardarCambios}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnSaveText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  content: { flex: 1, paddingHorizontal: 20 },
  label: { color: "#94A3B8", fontSize: 12, marginBottom: 5, marginTop: 15 },
  input: {
    backgroundColor: "#1E293B",
    color: "white",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  inputDisabled: {
    backgroundColor: "#0F172A",
    color: "#64748B",
  },
  hint: { color: "#64748B", fontSize: 11, marginTop: 4, fontStyle: "italic" },
  btnSave: {
    backgroundColor: "#FF4444",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  btnSaveDisabled: { opacity: 0.7 },
  btnSaveText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
