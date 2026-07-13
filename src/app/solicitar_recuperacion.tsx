import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/imagePath";

const API_URL = "http://192.168.1.10:5285/api";

const SolicitarRecuperacion = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEnviarCodigo = async () => {
    if (!email.includes("@")) {
      Alert.alert("Error", "Por favor ingrese un correo válido.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/Auth/solicitar-recuperacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Código enviado",
          "Si el correo existe, recibirás un código. Revisá la consola del backend para ver el código.",
          [
            {
              text: "OK",
              onPress: () =>
                router.push({
                  pathname: "/autenticar_codigo",
                  params: { email: email },
                }),
            },
          ],
        );
      } else {
        Alert.alert("Error", data.mensaje || "Error al procesar la solicitud");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
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
        <Image
          source={images.logoEgida}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Ingrese su correo electrónico para recibir un código de verificación.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleEnviarCodigo}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Enviar código</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1325" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backArrow: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: { width: 150, height: 150, marginBottom: 30 },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#A0AABF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#EAEAEA",
    borderRadius: 4,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#333",
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "600" },
});

export default SolicitarRecuperacion;
