import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://192.168.1.10:5285/api";

export default function PerfilScreen() {
  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contacto: "",
    alias: "",
    edad: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/Perfil/mi-perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDatos({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          contacto: data.contacto,
          alias: data.alias || "",
          edad: data.edad || 0,
        });
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
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
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={80} color="white" />
        </View>

        <View style={styles.infoContainer}>
          {datos.alias ? (
            <>
              <Text style={styles.label}>Alias</Text>
              <Text style={styles.value}>{datos.alias}</Text>
            </>
          ) : null}

          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{datos.nombre}</Text>

          <Text style={styles.label}>Apellido</Text>
          <Text style={styles.value}>{datos.apellido}</Text>

          <Text style={styles.label}>Correo</Text>
          <Text style={styles.value}>{datos.correo}</Text>

          <Text style={styles.label}>Contacto</Text>
          <Text style={styles.value}>{datos.contacto}</Text>
        </View>

        <TouchableOpacity
          style={styles.btnPrivacidad}
          onPress={() => router.push("/privacidad")}
        >
          <Ionicons name="lock-closed-outline" size={20} color="black" />
          <Text style={styles.btnPrivacidadText}>Privacidad</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backIcon: {
    color: "white",
    fontSize: 30,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  infoContainer: {
    width: "100%",
    maxWidth: 350,
  },
  label: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 5,
    marginTop: 15,
  },
  value: {
    color: "white",
    fontSize: 16,
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 8,
  },
  btnPrivacidad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F2",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
    width: "100%",
    maxWidth: 350,
    gap: 10,
  },
  btnPrivacidadText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});
