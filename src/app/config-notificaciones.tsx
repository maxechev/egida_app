import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../constants/urlApi"; // ✅ Importación correcta (eliminada la URL mal formada)

// Configurar cómo se muestran las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function ConfigNotificacionesScreen() {
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
          // ✅ Manejo seguro: si es string, lo separa; si ya es array, lo usa
          tiposAlertaNotificacion:
            typeof data.tiposAlertaNotificacion === "string"
              ? data.tiposAlertaNotificacion.split(",")
              : data.tiposAlertaNotificacion || [],
          gestoApagadoActivo: data.gestoApagadoActivo ?? true,
          confirmacionRapida: data.confirmacionRapida ?? true,
          tipoAlertaGesto: data.tipoAlertaGesto ?? "",
          sonidosActivos: data.sonidosActivos ?? true,
          vibracionSonido: data.vibracionSonido ?? true,
          tipoSonido: data.tipoSonido ?? "",
        });
      }
    } catch (error) {
      console.error("Error al cargar configuración de notificaciones:", error);
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
      console.error("Error al guardar configuración de notificaciones:", error);
    } finally {
      setGuardando(false);
    }
  };

  // ✅ Tipado estricto para evitar errores de TypeScript
  const actualizarCampo = async (campo: keyof typeof config, valor: any) => {
    const nuevaConfig = { ...config, [campo]: valor };
    setConfig(nuevaConfig);
    guardarConfiguracion(nuevaConfig);
  };

  // Solicitar permisos de notificación
  const solicitarPermisos = async (): Promise<boolean> => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Error", "Se necesitan permisos para mostrar notificaciones");
      return false;
    }
    return true;
  };

  // Toggle de notificaciones con permisos
  const toggleNotificaciones = async (valor: boolean) => {
    if (valor) {
      const tienePermisos = await solicitarPermisos();
      if (!tienePermisos) return;
    }
    actualizarCampo("notificacionesActivas", valor);
  };

  // Toggle de alertas específicas
  const toggleAlerta = (item: string) => {
    const nuevasAlertas = config.tiposAlertaNotificacion.includes(item)
      ? config.tiposAlertaNotificacion.filter((x) => x !== item)
      : [...config.tiposAlertaNotificacion, item];
    actualizarCampo("tiposAlertaNotificacion", nuevasAlertas);
  };

  const probarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Funciona!",
        body: "Las notificaciones funcionan, apruebenos porfa",
      },
      trigger: null,
    });
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

      <Text style={styles.title}>Configuración{"\n"}de Notificaciones</Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivás esta opción, ya no recibirás notificaciones de
          alertas que hayan sido enviadas dentro de la app.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Activar/Desactivar</Text>
          <Switch
            value={config.notificacionesActivas}
            onValueChange={toggleNotificaciones}
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
            value={config.vibracionNotificaciones}
            onValueChange={(val) =>
              actualizarCampo("vibracionNotificaciones", val)
            }
          />
        </View>
      </View>

      <TouchableOpacity style={styles.testButton} onPress={probarNotificacion}>
        <Text style={styles.testButtonText}>PROBAR NOTIFICACIÓN AHORA</Text>
      </TouchableOpacity>

      <View style={styles.selector}>
        <Pressable style={styles.prioridad}>
          <Text style={styles.prioridadText}>Tipos de alerta a notificar</Text>
        </Pressable>

        <View style={styles.lista}>
          {[
            "Robo",
            "Secuestro de vehículo",
            "Allanamiento",
            "Secuestro",
            "Actividad sospechosa",
            "Disparos de arma de fuego",
          ].map((item) => (
            <Pressable
              key={item}
              style={styles.item}
              onPress={() => toggleAlerta(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
              <View
                style={[
                  styles.checkbox,
                  config.tiposAlertaNotificacion.includes(item) &&
                    styles.checked,
                ]}
              >
                {config.tiposAlertaNotificacion.includes(item) && (
                  <Text style={styles.check}>✓</Text>
                )}
              </View>
            </Pressable>
          ))}
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
  testButton: {
    backgroundColor: "#FF4444",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
  testButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  selector: {
    backgroundColor: "#F0F0F2",
    width: "90%",
    maxWidth: 300,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  prioridad: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#334155",
  },
  prioridadText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  lista: {
    backgroundColor: "#F0F0F2",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#334155",
  },
  itemText: {
    color: "black",
    fontSize: 14,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#94A3B8",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#FF4444", // ✅ Check rojo cuando está activo
    borderColor: "#FF4444",
  },
  check: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#F0F0F2",
    padding: 10,
    borderRadius: 8,
  },
});
