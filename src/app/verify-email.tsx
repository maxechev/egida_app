import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const icon = require("../assets/images/logo_egida.png");

export default function VerifyEmailScreen() {
  const [token, setToken] = useState("");
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const savedEmail = await SecureStore.getItemAsync(
        "pendingVerificationEmail",
      );
      if (savedEmail) {
        setCorreo(savedEmail);
      } else {
        // Si no hay correo guardado, volver al registro
        router.replace("/register");
      }
    })();
  }, []);

  const verificarEmail = async () => {
    if (!token.trim()) {
      Alert.alert("Error", "Ingresá el código de verificación");
      return;
    }
    if (!correo) {
      Alert.alert("Error", "No se encontró el correo registrado");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://192.168.1.10:5285/api/Auth/verificar-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo: correo,
            token: token.trim(),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Limpiar dato temporal
        await SecureStore.deleteItemAsync("pendingVerificationEmail");
        Alert.alert("Éxito", "Email verificado correctamente", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Error", data.mensaje || "Token inválido o expirado");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#10172B",
        alignItems: "center",
        paddingTop: 50,
      }}
    >
      <StatusBar style="light" />

      <TouchableOpacity
        style={{ position: "absolute", left: 20, top: 50 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "white", fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Image source={icon} style={{ width: 180, height: 180, marginTop: 40 }} />

      <Text
        style={{
          color: "#F0F0F2",
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Confirmar correo
      </Text>

      <Text
        style={{
          color: "#94A3B8",
          fontSize: 14,
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Se envió un código a: {"\n"}
        <Text style={{ color: "#FFF", fontWeight: "bold" }}>{correo}</Text>
      </Text>

      <TextInput
        placeholder="Código de verificación"
        value={token}
        onChangeText={setToken}
        style={{
          backgroundColor: "#F0F0F2",
          width: "80%",
          maxWidth: 320,
          height: 45,
          paddingHorizontal: 15,
          borderRadius: 6,
          marginBottom: 20,
          fontSize: 15,
          color: "#000",
        }}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={{
          backgroundColor: isLoading ? "#CCC" : "#F0F0F2",
          width: 170,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 6,
        }}
        onPress={verificarEmail}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#10172B" />
        ) : (
          <Text style={{ color: "#10172B", fontWeight: "bold" }}>
            Verificar
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
