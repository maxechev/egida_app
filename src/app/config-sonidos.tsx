import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
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
import { API_URL } from "../constants/urlApi";

export default function ConfigSonidosScreen() {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [config, setConfig] = useState({
    sonidosActivos: true,
    vibracionSonido: true,
    tipoSonido: "",
    notificacionesActivas: true,
    vibracionNotificaciones: true,
    tiposAlertaNotificacion: [] as string[],
    gestoApagadoActivo: true,
    confirmacionRapida: true,
    tipoAlertaGesto: "",
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
          sonidosActivos: data.sonidosActivos ?? true,
          vibracionSonido: data.vibracionSonido ?? true,
          tipoSonido: data.tipoSonido ?? "",
          notificacionesActivas: data.notificacionesActivas ?? true,
          vibracionNotificaciones: data.vibracionNotificaciones ?? true,
          tiposAlertaNotificacion: data.tiposAlertaNotificacion
            ? data.tiposAlertaNotificacion.split(",")
            : [],
          gestoApagadoActivo: data.gestoApagadoActivo ?? true,
          confirmacionRapida: data.confirmacionRapida ?? true,
          tipoAlertaGesto: data.tipoAlertaGesto ?? "",
          mostrarNombre: data.mostrarNombre ?? true,
          mostrarUbicacion: data.mostrarUbicacion ?? true,
          mostrarContacto: data.mostrarContacto ?? true,
        });
      }
    } catch (error) {
      console.error("Error al cargar configuración de sonidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async (nuevaConfig: typeof config) => {
    try {
      setGuardando(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      await fetch(`${API_URL}/Configuracion/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaConfig),
      });
    } catch (error) {
      console.error("Error al guardar configuración de sonidos:", error);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarCampo = (campo: keyof typeof config, valor: any) => {
    const nuevaConfig = { ...config, [campo]: valor };
    setConfig(nuevaConfig);
    guardarConfiguracion(nuevaConfig);
  };

  const sonidosMap: Record<string, any> = {
    Sirena: require("../../assets/sonidos/Sirena.mp3"),
    "Alarma de android": require("../../assets/sonidos/Alarma de android.mp3"),
    "Sonido 3": require("../../assets/sonidos/Sonido 3.mp3"),
    "Sonido 4": require("../../assets/sonidos/Sonido 4.mp3"),
    "Sonido 5": require("../../assets/sonidos/Sonido 5.mp3"),
    "Sonido 6": require("../../assets/sonidos/Sonido 6.mp3"),
  };

  const reproducirSonido = async (tipoSonido: string) => {
    if (!config.sonidosActivos || !tipoSonido) return;

    const sonidoPath = sonidosMap[tipoSonido];
    if (!sonidoPath) return;

    try {
      const { sound } = await Audio.Sound.createAsync(sonidoPath, {
        shouldPlay: true,
      });
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIconText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Configuración{"\n"}de sonidos</Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivás esta opción, seguirás recibiendo
          notificaciones, solo que el teléfono ya no emitirá ningún sonido al
          mostrarlas.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Activar/Desactivar</Text>
          <Switch
            value={config.sonidosActivos}
            onValueChange={(val) => actualizarCampo("sonidosActivos", val)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivás esta opción, seguirás recibiendo
          notificaciones, solo que sin que el teléfono vibre al mostrarlas.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Vibración</Text>
          <Switch
            value={config.vibracionSonido}
            onValueChange={(val) => actualizarCampo("vibracionSonido", val)}
          />
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={config.tipoSonido}
          onValueChange={(itemValue) => {
            actualizarCampo("tipoSonido", itemValue);
            if (itemValue) reproducirSonido(itemValue);
          }}
          style={{ color: "black" }}
        >
          <Picker.Item label="Tipo de sonido" value="" color="black" />
          <Picker.Item label="Sirena" value="Sirena" color="black" />
          <Picker.Item
            label="Alarma de android"
            value="Alarma de android"
            color="black"
          />
          <Picker.Item label="Sonido 3" value="Sonido 3" color="black" />
          <Picker.Item label="Sonido 4" value="Sonido 4" color="black" />
          <Picker.Item label="Sonido 5" value="Sonido 5" color="black" />
          <Picker.Item label="Sonido 6" value="Sonido 6" color="black" />
        </Picker>
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
  container: { flex: 1, backgroundColor: "#10172B" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#10172B",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  backIconText: { color: "white", fontSize: 30 },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    borderTopWidth: 1,
    borderColor: "#666",
    padding: 20,
  },
  description: {
    color: "white",
    fontSize: 11,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: "#F0F0F2",
    width: 250,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 8,
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
