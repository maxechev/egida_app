import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    SafeAreaView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL = "http://${API_URL}:5285/api";

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

export default function ConfiNotificacionesScreen() {
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

  // ... dentro del componente, antes del return:
  const probarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Funciona! 🚀",
        body: "Si ves esto, las notificaciones están 100% operativas.",
      },
      trigger: null, // null significa "mostrar YA"
    });
  };

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
        Configuración{"\n"}de Notificaciones
      </Text>

      <View style={styles.section}>
        <Text style={styles.description}>
          Atención: si desactivas esta opción, ya no recibirás notificaciones de
          alertas que hayan sido enviadas dentro de la app
        </Text>

        <View style={styles.row}>
          <Text style={styles.title}>Activar/Desactivar</Text>
          <Switch
            value={config.notificacionesActivas}
            onValueChange={toggleNotificaciones}
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
            value={config.vibracionNotificaciones}
            onValueChange={(val) =>
              actualizarCampo("vibracionNotificaciones", val)
            }
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          alignItems: "center",
        }}
        onPress={probarNotificacion}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          PROBAR NOTIFICACIÓN AHORA
        </Text>
      </TouchableOpacity>

      <View style={styles.selector}>
        <Pressable style={styles.prioridad} onPress={() => {}}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Prioridad</Text>
        </Pressable>

        <View style={styles.lista}>
          {[
            "Robo",
            "Secuestro de vehículo",
            "Hallanamiento",
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
  lista: {
    backgroundColor: "white",
    width: 250,
    alignSelf: "center" as const,
    marginTop: 20 as const,
  },
  item: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 10 as const,
    paddingVertical: 10 as const,
    borderBottomWidth: 1 as const,
    borderColor: "#ddd" as const,
  },
  itemText: {
    color: "#333" as const,
    fontSize: 14 as const,
    width: 190 as const,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  checked: {
    backgroundColor: "#26200F",
    borderColor: "#26200F",
  },
  check: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold" as const,
  },
  selector: {
    backgroundColor: "white",
    width: 250,
    alignSelf: "center" as const,
    marginTop: 20,
  },
  prioridad: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 25,
    height: 60,
  },
};
