import imagePath from "@/src/constants/imagePath";
import { API_URL } from "@/src/constants/urlApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = () => {
    router.push("/solicitar_recuperacion");
  };

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Complete correo y contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.mensaje || "Error al iniciar sesión");
        return;
      }

      console.log("TOKEN:", data.token);
      await SecureStore.setItemAsync("token", data.token);

      // ✅ VERIFICAR SI YA HAY UNA RED GUARDADA
      const redActivaExistente = await SecureStore.getItemAsync("redActivaId");

      if (redActivaExistente) {
        console.log("✅ Usando redActivaId guardada:", redActivaExistente);
      } else {
        console.log("⚠️ No hay red guardada. Buscando redes del usuario...");

        // ✅ BUSCAR LAS REDES DEL USUARIO
        const redesResponse = await fetch(`${API_URL}/Red/mis-redes`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (redesResponse.ok) {
          const redes = await redesResponse.json();
          console.log(" Redes encontradas:", redes);

          if (redes.length > 0) {
            // Guardar la primera red como activa
            await SecureStore.setItemAsync(
              "redActivaId",
              redes[0].id.toString(),
            );
            console.log(" Red activa guardada automáticamente:", redes[0].id);
          } else {
            console.log("⚠️ El usuario no pertenece a ninguna red");
            Alert.alert(
              "Sin redes",
              "No pertenecés a ninguna red todavía. Unite a una desde el menú.",
              [{ text: "OK" }],
            );
          }
        }
      }

      router.replace("/home");
    } catch (error: any) {
      console.log("FETCH ERROR:", error);
      Alert.alert(
        "Error",
        "No se pudo conectar con el servidor. Verificá tu red Wi-Fi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={imagePath.logoEgida}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          style={[styles.input, styles.passwordInput]}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleForgotPassword}
        disabled={isLoading}
        style={styles.forgotContainer}
      >
        <Text style={[styles.forgotText, isLoading && styles.disabledText]}>
          ¿Olvidó su contraseña?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={login}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Ingresando..." : "Iniciar sesión"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/register")}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10172B",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logo: { width: 180, height: 180, marginBottom: 20 },
  title: {
    color: "#F0F0F2",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#F0F0F2",
    width: "100%",
    maxWidth: 320,
    height: 48,
    marginBottom: 15,
    paddingHorizontal: 16,
    borderRadius: 6,
    color: "#000",
    fontSize: 15,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 320,
    marginBottom: 15,
  },
  passwordInput: { marginBottom: 0, paddingRight: 50 },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 25,
    maxWidth: 320,
    width: "100%",
  },
  forgotText: { color: "#A0AABF", fontSize: 13, textAlign: "right" },
  disabledText: { opacity: 0.5 },
  button: {
    backgroundColor: "#F0F0F2",
    width: 150,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 15,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#10172B", fontSize: 16, fontWeight: "bold" },
});
