import { API_URL } from "@/src/constants/urlApi";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PrivacidadScreen() {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  //Unificamos la configuración en un solo objeto
  const [config, setConfig] = useState({
    mostrarNombre: true,
    mostrarUbicacion: true,
    mostrarContacto: true,
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/Configuracion/mi-configuracion`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setConfig({
          mostrarNombre: data.mostrarNombre ?? true,
          mostrarUbicacion: data.mostrarUbicacion ?? true,
          mostrarContacto: data.mostrarContacto ?? true,
        });
      }
    } catch (error) {
      console.error("Error al cargar configuración de privacidad:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async (nuevaConfig: typeof config) => {
    try {
      setGuardando(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      //Enviamos TODA la configuración para que el backend no falle por campos nulos
      await fetch(`${API_URL}/Configuracion/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notificacionesActivas: true,
          vibracionNotificaciones: true,
          tiposAlertaNotificacion: [],
          gestoApagadoActivo: true,
          confirmacionRapida: true,
          tipoAlertaGesto: "",
          sonidosActivos: true,
          vibracionSonido: true,
          tipoSonido: "",
          mostrarNombre: nuevaConfig.mostrarNombre,
          mostrarUbicacion: nuevaConfig.mostrarUbicacion,
          mostrarContacto: nuevaConfig.mostrarContacto,
        }),
      });
    } catch (error) {
      console.error("Error al guardar configuración de privacidad:", error);
    } finally {
      setGuardando(false);
    }
  };

  //Tipado estricto para evitar errores de TypeScript
  const actualizarCampo = (campo: keyof typeof config, valor: boolean) => {
    const nuevaConfig = { ...config, [campo]: valor };
    setConfig(nuevaConfig);
    guardarConfiguracion(nuevaConfig);
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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIconText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Privacidad</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Mostrar nombre</Text>
        <Text style={styles.description}>
          Atención: si desactivás esta opción, las demás personas no verán tu
          nombre real, solo tu alias.
        </Text>
        <View style={styles.row}>
          <Text style={styles.switchLabel}>Activar/Desactivar</Text>
          <Switch
            value={config.mostrarNombre}
            onValueChange={(val) => actualizarCampo("mostrarNombre", val)}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Ubicación</Text>
        <Text style={styles.description}>
          Atención: si desactivás esta opción, no podremos saber tu ubicación
          cuando estés en el mapa y/o cuando quieras enviar una alerta.
        </Text>
        <View style={styles.row}>
          <Text style={styles.switchLabel}>Activar/Desactivar</Text>
          <Switch
            value={config.mostrarUbicacion}
            onValueChange={(val) => actualizarCampo("mostrarUbicacion", val)}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Contacto</Text>
        <Text style={styles.description}>
          Atención: si desactivás esta opción, las personas que sepan que
          mandaste alguna alarma no podrán contactarse contigo.
        </Text>
        <View style={styles.row}>
          <Text style={styles.switchLabel}>Activar/Desactivar</Text>
          <Switch
            value={config.mostrarContacto}
            onValueChange={(val) => actualizarCampo("mostrarContacto", val)}
          />
        </View>
      </View>

      {guardando && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="white" />
        </View>
      )}
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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backIconText: {
    color: "white",
    fontSize: 30,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 70,
    marginBottom: 30,
  },
  card: {
    borderTopWidth: 1,
    borderColor: "#6B7280",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    color: "white",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1E293B",
    padding: 10,
    borderRadius: 8,
  },
});
