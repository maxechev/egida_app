import { router, useLocalSearchParams } from "expo-router";
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
import { API_URL } from "../constants/urlApi";

const AutenticarCodigo = () => {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerificarCodigo = async () => {
    if (code.length < 6) {
      Alert.alert("Error", "El código debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/Auth/validar-codigo-recuperacion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo: email,
            token: code.trim(),
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.valido) {
        router.replace({
          pathname: "/recuperar_contrasenia",
          params: {
            email: email,
            token: code.trim(),
          },
        });
      } else {
        Alert.alert("Error", data.mensaje || "Código inválido o expirado");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReenviar = async () => {
    try {
      const response = await fetch(`${API_URL}/Auth/solicitar-recuperacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email }),
      });

      if (response.ok) {
        Alert.alert(
          "Código reenviado",
          `Hemos enviado un nuevo código a ${email}. Revisá la consola del backend.`,
        );
        setCode("");
      } else {
        Alert.alert("Error", "No se pudo reenviar el código");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
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

        <Text style={styles.title}>Verificar identidad</Text>
        <Text style={styles.subtitle}>
          Ingresa el código que enviamos a tu correo.
        </Text>

        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="Código"
          placeholderTextColor="#999"
          keyboardType="default"
          value={code}
          onChangeText={setCode}
          textAlign="center"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerificarCodigo}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Confirmar código</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReenviar} style={{ marginTop: 20 }}>
          <Text style={styles.resendText}>
            ¿No recibiste el código? Reenviar
          </Text>
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
  codeInput: { letterSpacing: 4, fontSize: 18, fontWeight: "bold" },
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
  resendText: {
    color: "#A0AABF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default AutenticarCodigo;
