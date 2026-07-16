import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../constants/urlApi";
export default function ConfigGestosScreen() {
  const [config, setConfig] = useState({
    gestoApagadoActivo: true,
    confirmacionRapida: true,
    tipoAlertaGesto: "",
  });
  const [guardando, setGuardando] = useState(false);

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
          gestoApagadoActivo: data.gestoApagadoActivo ?? true,
          confirmacionRapida: data.confirmacionRapida ?? true,
          tipoAlertaGesto: data.tipoAlertaGesto ?? "",
        });
      }
    } catch (error) {
      console.error("Error al cargar config. de gestos:", error);
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
        body: JSON.stringify({
          notificacionesActivas: true,
          vibracionNotificaciones: true,
          tiposAlertaNotificacion: [],
          gestoApagadoActivo: nuevaConfig.gestoApagadoActivo,
          confirmacionRapida: nuevaConfig.confirmacionRapida,
          tipoAlertaGesto: nuevaConfig.tipoAlertaGesto,
          sonidosActivos: true,
          vibracionSonido: true,
          tipoSonido: "",
          mostrarNombre: true,
          mostrarUbicacion: true,
          mostrarContacto: true,
        }),
      });
    } catch (error) {
      console.error("Error al guardar config. de gestos:", error);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarCampo = (campo: keyof typeof config, valor: any) => {
    const nuevaConfig = { ...config, [campo]: valor };
    setConfig(nuevaConfig);
    guardarConfiguracion(nuevaConfig);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIconText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Configuración{"\n"}de gestos</Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Al apretar 3 veces seguidas el botón de apagado, el teléfono entrará
          en modo de alertas, y dependiendo de cuantas veces se apriete el botón
          de subir volumen, enviará un tipo de alerta.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Botón de apagado</Text>
          <Switch
            value={config.gestoApagadoActivo}
            onValueChange={(val) => actualizarCampo("gestoApagadoActivo", val)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.description}>
          Cuando hagas un gesto de alerta, la alerta será configurada
          automáticamente y luego enviada con el tipo de alerta elegido en las
          configuraciones.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Confirmación rápida</Text>
          <Switch
            value={config.confirmacionRapida}
            onValueChange={(val) => actualizarCampo("confirmacionRapida", val)}
          />
        </View>
      </View>

      {/* Picker con fondo oscuro y texto blanco */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={config.tipoAlertaGesto}
          onValueChange={(itemValue) =>
            actualizarCampo("tipoAlertaGesto", itemValue)
          }
          style={{ color: "black" }}
        >
          <Picker.Item label="Tipo de alerta rápida" value="" color="black" />
          <Picker.Item label="Robo" value="Robo" color="black" />
          <Picker.Item
            label="Secuestro de vehículo"
            value="Secuestro de vehículo"
            color="black"
          />
          <Picker.Item
            label="Allanamiento"
            value="Allanamiento"
            color="black"
          />
          <Picker.Item label="Secuestro" value="Secuestro" color="black" />
          <Picker.Item
            label="Actividad sospechosa"
            value="Actividad sospechosa"
            color="black"
          />
          <Picker.Item
            label="Disparos de arma de fuego"
            value="Disparos de arma de fuego"
            color="black"
          />
        </Picker>
      </View>

      {/* Indicador visual de que se está guardando */}
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
    padding: 12,
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
