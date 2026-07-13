import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL = "http://192.168.1.10:5285/api";

interface UsuarioComunidad {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  contacto: string;
  alias: string | null;
  fotoPerfil: string | null;
  edad: number;
}

export default function ComunidadScreen() {
  const [usuarios, setUsuarios] = useState<UsuarioComunidad[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<
    UsuarioComunidad[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (filtro) {
      const filtrados = usuarios.filter(
        (u) =>
          u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
          u.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
          (u.alias && u.alias.toLowerCase().includes(filtro.toLowerCase())),
      );
      setUsuariosFiltrados(filtrados);
    } else {
      setUsuariosFiltrados(usuarios);
    }
  }, [filtro, usuarios]);

  const cargarUsuarios = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const redActiva = await SecureStore.getItemAsync("redActivaId");

      if (!token || !redActiva) return;

      const response = await fetch(
        `${API_URL}/Usuario/usuarios-por-red?redId=${redActiva}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Error al cargar usuarios:", response.status);
        return;
      }

      const data = await response.json();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.error("Error al cargar comunidad:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: UsuarioComunidad }) => (
    <TouchableOpacity
      style={styles.usuarioCard}
      onPress={() =>
        router.push({
          pathname: "/perfil_usuario",
          params: {
            id: item.id,
            nombre: item.nombre,
            apellido: item.apellido,
            alias: item.alias || "",
            correo: item.correo,
            contacto: item.contacto,
          },
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.nombre.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.usuarioInfo}>
        <Text style={styles.usuarioNombre}>
          {item.alias || `${item.nombre} ${item.apellido}`}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btnMensaje}
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: {
              usuarioId: item.id,
              nombre: item.alias || `${item.nombre} ${item.apellido}`,
            },
          })
        }
      >
        <Ionicons name="chatbubble-outline" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4444" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comunidad</Text>
        <TouchableOpacity onPress={() => setMostrarFiltro(!mostrarFiltro)}>
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {mostrarFiltro && (
        <View style={styles.filtroContainer}>
          <TextInput
            style={styles.filtroInput}
            placeholder="Buscar por nombre, apellido o alias..."
            placeholderTextColor="#94A3B8"
            value={filtro}
            onChangeText={setFiltro}
          />
        </View>
      )}

      <FlatList
        data={usuariosFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backIcon: {
    color: "white",
    fontSize: 30,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  filtroContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filtroInput: {
    backgroundColor: "#1E293B",
    color: "white",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
  },
  usuarioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNombre: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  btnMensaje: {
    padding: 10,
  },
});
