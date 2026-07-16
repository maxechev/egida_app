import { API_URL } from "@/src/constants/urlApi"; 
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react"; 
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OpcionesScreen() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajesNoLeidosRed, setMensajesNoLeidosRed] = useState(0);
  const [mensajesNoLeidosPrivados, setMensajesNoLeidosPrivados] = useState(0);

  useEffect(() => {
    cargarMensajesNoLeidos();
    const intervalo = setInterval(cargarMensajesNoLeidos, 5000); // Actualizar cada 5 seg
    return () => clearInterval(intervalo);
  }, []);

  const cargarMensajesNoLeidos = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const redActiva = await SecureStore.getItemAsync("redActivaId");

      if (token && redActiva) {
        const response = await fetch(
          `${API_URL}/MensajeNoLeido/red/total/${redActiva}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const responsePriv = await fetch(
          `${API_URL}/MensajeNoLeido/privados/total`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (responsePriv.ok) {
          const dataPriv = await responsePriv.json();
          setMensajesNoLeidosPrivados(dataPriv.total);
        }
      }
    } catch (error) {
      console.error("Error cargando mensajes no leídos:", error);
    }
  };

  const cerrarSesion = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("redActivaId");

      setMostrarModal(false);

      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#10172B",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", left: 20, top: 50 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "white", fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginTop: 50,
        }}
      >
        Opciones
      </Text>

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          top: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#1E293B",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => router.push("/perfil")}
      >
        <Ionicons name="person" size={35} color="white" />
      </TouchableOpacity>

      <View style={{ marginTop: 190, gap: 25 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/alertaopc")}
        >
          <Text style={styles.text}>Alertas</Text>
        </TouchableOpacity>

        {/* ✅ CORRECCIÓN: Agregado onPress para navegar al historial */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/historial_alertas")}
        >
          <Text style={styles.text}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/comunidad");
          }}
        >
          <Text style={styles.text}>Comunidad</Text>
          {mensajesNoLeidosPrivados > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {mensajesNoLeidosPrivados > 99
                  ? "99+"
                  : mensajesNoLeidosPrivados}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/chat_red");
            setMensajesNoLeidosRed(0);
          }}
        >
          <Text style={styles.text}>Chat de la red</Text>
          {mensajesNoLeidosRed > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {mensajesNoLeidosRed > 99 ? "99+" : mensajesNoLeidosRed}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ position: "absolute", bottom: 80 }}
        onPress={() => setMostrarModal(true)}
      >
        <Text style={{ color: "red", fontWeight: "bold" }}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Modal visible={mostrarModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#10172B",
              width: 320,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "yellow",
                fontSize: 34,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Atención
            </Text>

            <Text
              style={{
                color: "white",
                textAlign: "center",
                marginTop: 20,
                marginBottom: 25,
              }}
            >
              Al cerrar sesión deberá volver a iniciar sesión para acceder a su
              cuenta. ¿Desea continuar?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 15,
              }}
            >
              <TouchableOpacity onPress={() => setMostrarModal(false)}>
                <Text style={{ backgroundColor: "white", padding: 8 }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={cerrarSesion}>
                <Text style={{ backgroundColor: "white", padding: 8 }}>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  button: {
    backgroundColor: "#F0F0F2",
    width: 170,
    height: 55,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    position: "relative" as const,
  },
  text: {
    fontWeight: "bold" as const,
    color: "#10172B",
    fontSize: 20,
  },
  badge: {
    position: "absolute" as const,
    top: -8,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold" as const,
  },
};
