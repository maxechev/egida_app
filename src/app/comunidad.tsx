import { API_URL } from "@/src/constants/urlApi";
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

interface UsuarioComunidad {
  id: number;
  nombre: string | null; // ✅ Ahora puede ser null por privacidad
  apellido: string | null;
  correo: string;
  contacto: string | null;
  alias: string | null;
  fotoPerfil: string | null;
  edad: number;
}

export default function ComunidadScreen() {
  const [usuarios, setUsuarios] = useState<UsuarioComunidad[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<
    UsuarioComunidad[]
  >([]);
  const [mensajesNoLeidosPorUsuario, setMensajesNoLeidosPorUsuario] = useState<
    Record<number, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    cargarMensajesNoLeidos();
    const intervalo = setInterval(cargarMensajesNoLeidos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarMensajesNoLeidos = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${API_URL}/MensajeNoLeido/privados/por-usuario`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        const conteos: Record<number, number> = {};
        data.forEach((item: any) => {
          conteos[item.usuarioId] = item.noLeidos;
        });
        setMensajesNoLeidosPorUsuario(conteos);
      }
    } catch (error) {
      console.error("Error cargando mensajes no leídos:", error);
    }
  };

  useEffect(() => {
    if (filtro) {
      const filtrados = usuarios.filter(
        (u) =>
          (u.nombre && u.nombre.toLowerCase().includes(filtro.toLowerCase())) ||
          (u.apellido &&
            u.apellido.toLowerCase().includes(filtro.toLowerCase())) ||
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

  const renderItem = ({ item }: { item: UsuarioComunidad }) => {
    const noLeidos = mensajesNoLeidosPorUsuario[item.id] || 0;

    const inicial = item.nombre
      ? item.nombre.charAt(0).toUpperCase()
      : item.alias
        ? item.alias.charAt(0).toUpperCase()
        : "U";

    // ✅ Nombre a mostrar: prioriza el alias, si no hay, usa nombre+apellido, si no, "Usuario Anónimo"
    const nombreMostrar =
      item.alias ||
      (item.nombre ? `${item.nombre} ${item.apellido}` : "Usuario Anónimo");

    return (
      <TouchableOpacity
        style={styles.usuarioCard}
        onPress={() => {
          router.push({
            pathname: "/perfil_usuario",
            params: {
              id: item.id,
              nombre: item.nombre || "Usuario",
              apellido: item.apellido || "Anónimo",
              alias: item.alias || "",
              correo: item.correo,
              contacto: item.contacto || "Oculto",
            },
          });
          marcarComoLeido(item.id);
        }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <View style={styles.usuarioInfo}>
          <Text style={styles.usuarioNombre}>{nombreMostrar}</Text>
        </View>

        {/* ✅ Badge de mensajes no leídos */}
        {noLeidos > 0 && (
          <View style={styles.badgeUsuario}>
            <Text style={styles.badgeUsuarioText}>
              {noLeidos > 9 ? "9+" : noLeidos}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.btnMensaje}
          onPress={() => {
            router.push({
              pathname: "/chat",
              params: {
                usuarioId: item.id,
                nombre: nombreMostrar,
              },
            });
            marcarComoLeido(item.id);
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const marcarComoLeido = async (usuarioId: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      await fetch(
        `${API_URL}/MensajeNoLeido/privados/marcar-leido/${usuarioId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Recargar conteos
      cargarMensajesNoLeidos();
    } catch (error) {
      console.error("Error marcando como leído:", error);
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
  badgeUsuario: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 10,
  },
  badgeUsuarioText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});
