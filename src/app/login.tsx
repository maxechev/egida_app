import imagePath from "@/src/constants/imagePath";
import { Ionicons } from "@expo/vector-icons"; // Librería nativa de Expo para íconos profesionales
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

  // Nuevo estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = () => {
    Alert.alert(
      "Recuperar contraseña",
      "Esta funcionalidad aún no está implementada.",
    );
  };

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Complete correo y contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("1. Iniciando login");
      console.log("2. Enviando petición a la API");
      console.log("3. Respuesta recibida");

      try {
        const response = await fetch(
          "http://192.168.1.10:5285/api/Auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              correo: email,
              contrasena: password,
            }),
          },
        );

        const data = await response.json();

        console.log("STATUS:", response.status);
        console.log("BODY:", data);

        if (!response.ok) {
          Alert.alert("Error", data.mensaje);
          return;
        }

        console.log("TOKEN:", data.token);

        await SecureStore.setItemAsync("token", data.token);

        router.replace("/home");
      } catch (e: any) {
        console.log("FETCH ERROR:", e);
        console.log("MESSAGE:", e.message);
        throw e;
      }
    } catch (error: any) {
      console.log("ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);

      let msg = "Ocurrió un error al iniciar sesión.";

      switch (error.code) {
        case "auth/invalid-credential":
          msg = "Correo o contraseña incorrectos.";
          break;
        case "auth/network-request-failed":
          msg = "Sin conexión a Internet.";
          break;
      }

      Alert.alert("Error", msg);
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
        autoCapitalize="none" // Evita que el teclado sugiera mayúsculas al inicio del email
        style={styles.input}
      />

      {/* Contenedor relativo para posicionar el ojito dentro del input */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword} // Alterna entre oculto y visible
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none" // CRÍTICO: Evita que iOS/Android pongan mayúscula automática al primer caracter
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
  // Estilos nuevos para el campo de contraseña con ojito
  passwordContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 320,
    marginBottom: 15,
  },
  passwordInput: {
    marginBottom: 0, // Quitamos el margin bottom porque el contenedor lo maneja
    paddingRight: 50, // Espacio interno para que el texto no se superponga con el ojo
  },
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
