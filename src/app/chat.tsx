import { API_URL } from "@/src/constants/urlApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Mensaje {
  id: number;
  remitenteId: number;
  mensaje: string;
  fecha: string;
}

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const destinatarioId = parseInt(params.usuarioId as string);
  const nombreDestinatario = params.nombre as string;

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const [miUsuarioId, setMiUsuarioId] = useState<number | null>(null);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [ultimoMensajeId, setUltimoMensajeId] = useState<number>(0);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const [nuevoMensajeDe, setNuevoMensajeDe] = useState("");

  useEffect(() => {
    const obtenerMiId = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const id = parseInt(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        );
        setMiUsuarioId(id);
      }
    };
    obtenerMiId();
  }, []);

  const [esPrimeraCarga, setEsPrimeraCarga] = useState(true);

  useEffect(() => {
    if (!miUsuarioId) return;

    const marcarLeidos = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        await fetch(
          `${API_URL}/MensajeNoLeido/privados/marcar-leido/${destinatarioId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (error) {
        console.error("Error marcando como leído:", error);
      }
    };

    marcarLeidos();

    const cargarMensajes = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await fetch(`${API_URL}/Mensaje/${destinatarioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            const ultimoMsg = data[data.length - 1];

            if (
              !esPrimeraCarga &&
              ultimoMsg.remitenteId !== miUsuarioId &&
              ultimoMsg.id !== ultimoMensajeId
            ) {
              setUltimoMensajeId(ultimoMsg.id);
              setNuevoMensajeDe(nombreDestinatario);
              setMostrarNotificacion(true);
              setTimeout(() => setMostrarNotificacion(false), 3000);
            }

            setUltimoMensajeId(ultimoMsg.id);
            if (esPrimeraCarga) setEsPrimeraCarga(false);
          }

          setMensajes(data);
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 4000);
    return () => clearInterval(intervalo);
  }, [
    miUsuarioId,
    destinatarioId,
    ultimoMensajeId,
    nombreDestinatario,
    esPrimeraCarga,
  ]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    setEnviando(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(`${API_URL}/Mensaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinatarioId: destinatarioId,
          mensaje: nuevoMensaje.trim(),
        }),
      });

      if (response.ok) {
        setNuevoMensaje("");

        setMostrarToast(true);
        setTimeout(() => setMostrarToast(false), 2000);

        const token2 = await SecureStore.getItemAsync("token");
        const res = await fetch(`${API_URL}/Mensaje/${destinatarioId}`, {
          headers: { Authorization: `Bearer ${token2}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMensajes(data);
          setTimeout(
            () => flatListRef.current?.scrollToEnd({ animated: true }),
            100,
          );
        }
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    } finally {
      setEnviando(false);
    }
  };

  const renderMensajesAgrupados = () => {
    const grupos: { esMio: boolean; mensajes: Mensaje[] }[] = [];

    mensajes.forEach((msg) => {
      const esMio = msg.remitenteId === miUsuarioId;
      const ultimoGrupo = grupos[grupos.length - 1];

      if (ultimoGrupo && ultimoGrupo.esMio === esMio) {
        ultimoGrupo.mensajes.push(msg);
      } else {
        grupos.push({ esMio, mensajes: [msg] });
      }
    });

    return grupos;
  };

  const renderItem = ({
    item,
  }: {
    item: { esMio: boolean; mensajes: Mensaje[] };
  }) => {
    return (
      <View style={styles.grupoMensaje}>
        {item.mensajes.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.burbuja,
              item.esMio ? styles.burbujaMia : styles.burbujaOtra,
            ]}
          >
            <Text style={styles.textoBurbuja}>{msg.mensaje}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4444" />
      </View>
    );
  }

  const grupos = renderMensajesAgrupados();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0F172A" }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: 10 + insets.top }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{nombreDestinatario}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.headerLine} />

        {/* Indicador de fecha */}
        <View style={styles.fechaContainer}>
          <View style={styles.fechaBadge}>
            <Text style={styles.fechaText}>Hoy</Text>
          </View>
        </View>

        {/* Lista de mensajes */}
        <FlatList
          ref={flatListRef}
          data={grupos}
          renderItem={renderItem}
          keyExtractor={(item) => `grupo-${item.esMio}-${item.mensajes[0].id}`}
          contentContainerStyle={styles.listaMensajes}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
        />

        {/* Input de texto */}
        <View
          style={[styles.inputContainer, { paddingBottom: 10 + insets.bottom }]}
        >
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#666"
            value={nuevoMensaje}
            onChangeText={setNuevoMensaje}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.btnEnviar,
              (!nuevoMensaje.trim() || enviando) && styles.btnEnviarDisabled,
            ]}
            onPress={enviarMensaje}
            disabled={!nuevoMensaje.trim() || enviando}
          >
            {enviando ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="arrow-up" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        {/* Toast de confirmación */}
        {mostrarToast && (
          <View style={styles.toast}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.toastText}>Mensaje enviado</Text>
          </View>
        )}
        {mostrarNotificacion && (
          <View style={styles.notificacion}>
            <Ionicons name="chatbubble" size={20} color="#10B981" />
            <Text style={styles.notificacionText}>
              Nuevo mensaje de {nuevoMensajeDe}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backBtn: { padding: 5 },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  headerLine: { height: 1, backgroundColor: "#1E293B" },

  fechaContainer: { alignItems: "center", marginVertical: 10 },
  fechaBadge: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fechaText: { color: "#94A3B8", fontSize: 12 },

  listaMensajes: { padding: 15, flexGrow: 1, justifyContent: "flex-end" },

  grupoMensaje: { marginBottom: 12 },

  burbuja: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  burbujaMia: {
    alignSelf: "flex-end",
    backgroundColor: "#3B82F6",
    borderBottomRightRadius: 4,
  },
  burbujaOtra: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
  },

  textoBurbuja: { fontSize: 15, lineHeight: 20, color: "#1E293B" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#0F172A",
    borderTopWidth: 1,
    borderColor: "#1E293B",
  },
  input: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    color: "#1E293B",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
  },
  btnEnviar: {
    backgroundColor: "#1E293B",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 2,
  },
  btnEnviarDisabled: { opacity: 0.5 },
  toast: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  toastText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  notificacion: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 10,
    zIndex: 1000,
  },
  notificacionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
