import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../constants/urlApi";

export default function UnirseRedScreen() {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const unirseARed = async () => {
    if (!codigo.trim()) {
      Alert.alert("Error", "Ingresá el código de la red.");
      return;
    }

    if (codigo.trim().length !== 7) {
      Alert.alert("Error", "El código debe tener 7 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Sesión expirada. Iniciá sesión de nuevo.");
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_URL}/Red/unirse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigo: codigo.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar la nueva red como activa
        await SecureStore.setItemAsync("redActivaId", data.redId.toString());

        Alert.alert(
          "¡Te uniste!",
          `Ahora formás parte de la red "${data.nombre}".\n\nPodés cambiar entre redes desde la pantalla de Mis Redes.`,
          [
            {
              text: "Ir al Home",
              onPress: () => router.replace("/home"),
            },
          ],
        );
      } else {
        Alert.alert("Error", data.mensaje || "No se pudo unir a la red.");
      }
    } catch (error: any) {
      console.error("Error al unirse a red:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Unirse a una red</Text>
        <Text style={styles.subtitle}>
          Ingresá el código de 6 caracteres que te compartieron para unirte a
          esa red.
        </Text>

        <Text style={styles.label}>Código de red</Text>
        <TextInput
          placeholder="Ej: ABC123"
          value={codigo}
          onChangeText={setCodigo}
          style={[styles.input, styles.codeInput]}
          editable={!isLoading}
          maxLength={7}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={unirseARed}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#10172B" />
          ) : (
            <Text style={styles.buttonText}>Unirme a la red</Text>
          )}
        </TouchableOpacity>
      </View>
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
    left: 20,
    top: 50,
    zIndex: 10,
    padding: 10,
  },
  backArrow: { color: "white", fontSize: 30, fontWeight: "bold" },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 20,
  },
  label: {
    color: "#F0F0F2",
    fontSize: 14,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#F0F0F2",
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 15,
    color: "#000",
    marginBottom: 25,
  },
  codeInput: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 8,
    textTransform: "uppercase",
  },
  button: {
    backgroundColor: "#F0F0F2",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: "#10172B",
    fontSize: 16,
    fontWeight: "bold",
  },
});
