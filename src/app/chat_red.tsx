import { API_URL } from "@/src/constants/urlApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

interface MensajeRed {
  id: number;
  usuarioId: number;
  nombreMostrar: string;
  mensaje: string;
  fecha: string;
}

export default function ChatRedScreen() {
  const [mensajes, setMensajes] = useState<MensajeRed[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [redId, setRedId] = useState<number>(1);
  const [redNombre, setRedNombre] = useState<string>("Red");
  const [miUsuarioId, setMiUsuarioId] = useState<number | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  // 1. Cargar red activa y mi ID
  useEffect(() => {
    const inicializar = async () => {
      const token = await SecureStore.getItemAsync("token");
      const redActivaStr = await SecureStore.getItemAsync("redActivaId");

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const id = parseInt(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        );
        setMiUsuarioId(id);
      }

      if (redActivaStr) {
        const redIdNum = parseInt(redActivaStr);
        setRedId(redIdNum);

        try {
          const response = await fetch(`${API_URL}/Red/${redIdNum}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setRedNombre(data.nombre);
          }
        } catch (error) {
          console.error("Error cargando red:", error);
        }
      }
    };
    inicializar();
  }, []);

  // 2. Polling de mensajes cada 4 segundos
  useEffect(() => {
    if (!redId || !miUsuarioId) return;

    const marcarLeidos = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        await fetch(`${API_URL}/MensajeNoLeido/red/marcar-leido/${redId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error marcando como leído:", error);
      }
    };

    marcarLeidos();

    const cargarMensajes = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await fetch(`${API_URL}/MensajeRed/${redId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
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
  }, [redId, miUsuarioId]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    setEnviando(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(`${API_URL}/MensajeRed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          redId: redId,
          mensaje: nuevoMensaje.trim(),
        }),
      });

      if (response.ok) {
        setNuevoMensaje("");
        // Recarga inmediata
        const res = await fetch(`${API_URL}/MensajeRed/${redId}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  // Agrupar mensajes consecutivos del mismo usuario
  const renderMensajesAgrupados = () => {
    const grupos: { nombre: string; mensajes: MensajeRed[] }[] = [];

    mensajes.forEach((msg) => {
      const ultimoGrupo = grupos[grupos.length - 1];
      if (ultimoGrupo && ultimoGrupo.nombre === msg.nombreMostrar) {
        ultimoGrupo.mensajes.push(msg);
      } else {
        grupos.push({ nombre: msg.nombreMostrar, mensajes: [msg] });
      }
    });

    return grupos;
  };

  const renderItem = ({
    item,
  }: {
    item: { nombre: string; mensajes: MensajeRed[] };
  }) => {
    const esMio = item.mensajes[0].usuarioId === miUsuarioId;

    return (
      <View style={styles.grupoMensaje}>
        {/* Nombre del remitente (no mostrar si es mío) */}
        {!esMio && <Text style={styles.nombreRemitente}>{item.nombre}</Text>}

        {item.mensajes.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.burbuja,
              esMio ? styles.burbujaMia : styles.burbujaOtra,
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
          <Text style={styles.headerTitle}>{redNombre.toUpperCase()}</Text>
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
          keyExtractor={(item) => `grupo-${item.nombre}-${item.mensajes[0].id}`}
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

  keyboardView: { flex: 1 },
  listaMensajes: { padding: 15, flexGrow: 1, justifyContent: "flex-end" },

  grupoMensaje: { marginBottom: 12 },
  nombreRemitente: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: "600",
  },

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
});
