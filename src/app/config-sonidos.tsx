import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "http://${API_URL}:5285/api";

export default function ConfigSonidosScreen() {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [config, setConfig] = useState({
    notificacionesActivas: true,
    vibracionNotificaciones: true,
    tiposAlertaNotificacion: [] as string[],
    gestoApagadoActivo: true,
    confirmacionRapida: true,
    tipoAlertaGesto: "",
    sonidosActivos: true,
    vibracionSonido: true,
    tipoSonido: "",
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
          notificacionesActivas: data.notificacionesActivas ?? true,
          vibracionNotificaciones: data.vibracionNotificaciones ?? true,
          tiposAlertaNotificacion: data.tiposAlertaNotificacion || [],
          gestoApagadoActivo: data.gestoApagadoActivo ?? true,
          confirmacionRapida: data.confirmacionRapida ?? true,
          tipoAlertaGesto: data.tipoAlertaGesto || "",
          sonidosActivos: data.sonidosActivos ?? true,
          vibracionSonido: data.vibracionSonido ?? true,
          tipoSonido: data.tipoSonido || "",
        });
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error);
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
      console.error("Error al guardar:", error);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarCampo = (campo: string, valor: any) => {
    const nuevaConfig = { ...config, [campo]: valor };
    setConfig(nuevaConfig);
    guardarConfiguracion(nuevaConfig);
  };

  // Reproducir sonido de prueba
  // Mapeo estático de los sonidos (React Native necesita saber las rutas al compilar)
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
      <View
        style={{
          flex: 1,
          backgroundColor: "#10172B",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FF4444" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#10172B" }}>
      <TouchableOpacity
        style={{ position: "absolute", top: 50, left: 20 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "white", fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          alignSelf: "center",
          marginTop: 50,
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Configuración{"\n"}de sonidos
      </Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivas esta opción, seguirás recibiendo
          notificaciones solo que el teléfono ya no emitirá ningún sonido al
          mostrarlo
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>Activar/Desactivar</Text>
          <Switch
            value={config.sonidosActivos}
            onValueChange={(val) => actualizarCampo("sonidosActivos", val)}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Vibración</Text>
        <Text style={styles.description}>
          Atención: si desactivas esta opción, seguirás recibiendo
          notificaciones solo que sin que el teléfono vibre al mostrarlo
        </Text>

        <View style={styles.row}>
          <Text style={styles.switchText}>Activar/Desactivar</Text>
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
        >
          <Picker.Item label="Tipo de sonido" value="" />
          <Picker.Item label="Sirena" value="Sirena" />
          <Picker.Item label="Alarma de android" value="Alarma de android" />
          <Picker.Item label="Sonido 3" value="Sonido 3" />
          <Picker.Item label="Sonido 4" value="Sonido 4" />
          <Picker.Item label="Sonido 5" value="Sonido 5" />
          <Picker.Item label="Sonido 6" value="Sonido 6" />
        </Picker>
      </View>

      {guardando && (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#1E293B",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <ActivityIndicator size="small" color="white" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = {
  card: {
    borderTopWidth: 1,
    borderColor: "#6B7280",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  switchText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold" as const,
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
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold" as const,
  },
  pickerContainer: {
    backgroundColor: "white",
    width: 250,
    alignSelf: "center" as const,
    marginTop: 20,
    borderRadius: 8,
  },
};
