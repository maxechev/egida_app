import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { API_URL } from '../constants/urlApi';

export default function ConfigGestosScreen() {
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

  // Listener del acelerómetro
  useEffect(() => {
    let subscription: any;

    if (config.gestoApagadoActivo) {
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const aceleracion = Math.sqrt(x * x + y * y + z * z);
        if (aceleracion > 2.5) {
          console.log("¡Gesto de alerta detectado!");
          // Aquí podés navegar a la pantalla de alerta o mostrar un modal
        }
      });
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [config.gestoApagadoActivo]);

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

  const actualizarCampo = async (campo: string, valor: any) => {
    const nuevaConfig = { ...config, [campo]: valor };
    setConfig(nuevaConfig);
    guardarConfiguracion(nuevaConfig);

    // Pedir permisos si se activa el gesto
    if (campo === "gestoApagadoActivo" && valor) {
      await Accelerometer.requestPermissionsAsync();
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
        Configuración{"\n"}de gestos
      </Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Al sacudir el teléfono, se activará el modo de alertas.
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>Gesto de alerta</Text>
          <Switch
            value={config.gestoApagadoActivo}
            onValueChange={(val) => actualizarCampo("gestoApagadoActivo", val)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.description}>
          Cuando hagas un gesto de alerta, la alerta será enviada
          automáticamente con el tipo elegido.
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>Confirmación rápida</Text>
          <Switch
            value={config.confirmacionRapida}
            onValueChange={(val) => actualizarCampo("confirmacionRapida", val)}
          />
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={config.tipoAlertaGesto}
          onValueChange={(itemValue) =>
            actualizarCampo("tipoAlertaGesto", itemValue)
          }
        >
          <Picker.Item label="Tipo de alerta rápida" value="" />
          <Picker.Item label="Robo" value="Robo" />
          <Picker.Item
            label="Secuestro de vehículo"
            value="Secuestro de vehículo"
          />
          <Picker.Item label="Hallanamiento" value="Hallanamiento" />
          <Picker.Item label="Secuestro" value="Secuestro" />
          <Picker.Item
            label="Actividad sospechosa"
            value="Actividad sospechosa"
          />
          <Picker.Item
            label="Disparos de arma de fuego"
            value="Disparos de arma de fuego"
          />
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
