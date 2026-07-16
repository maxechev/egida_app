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
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/imagePath";
import { API_URL } from "../constants/urlApi";

export default function VerifyEmailScreen() {
  const [codigo, setCodigo] = useState("");
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
        router.replace("/register");
      }
    })();
  }, []);

  const verificarEmail = async () => {
    if (codigo.length !== 5) {
      Alert.alert("Error", "El código debe tener exactamente 5 dígitos.");
      return;
    }
    if (!correo) {
      Alert.alert("Error", "No se encontró el correo registrado.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/Auth/verificar-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo,
          codigo: codigo.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.deleteItemAsync("pendingVerificationEmail");
        Alert.alert("Éxito", "Email verificado correctamente", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Error", data.mensaje || "Código inválido o expirado.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      Alert.alert(
        "Error",
        "No se pudo conectar con el servidor. Verificá tu conexión.",
      );
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
        style={{ position: "absolute", left: 20, top: 50, zIndex: 10 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "white", fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Image
        source={images.logoEgida}
        style={{ width: 180, height: 180, marginTop: 40 }}
        resizeMode="contain"
      />

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
          paddingHorizontal: 20,
        }}
      >
        Se envió un código de 5 dígitos a: {"\n"}
        <Text style={{ color: "#FFF", fontWeight: "bold" }}>{correo}</Text>
      </Text>

      <TextInput
        placeholder="00000"
        value={codigo}
        onChangeText={setCodigo}
        style={{
          backgroundColor: "#F0F0F2",
          width: "80%",
          maxWidth: 320,
          height: 50,
          paddingHorizontal: 15,
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 20,
          fontWeight: "bold",
          letterSpacing: 8,
          textAlign: "center",
          color: "#000",
        }}
        keyboardType="number-pad"
        maxLength={5}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={{
          backgroundColor: isLoading ? "#64748B" : "#F0F0F2",
          width: 170,
          height: 45,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
        onPress={verificarEmail}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#10172B" />
        ) : (
          <Text style={{ color: "#10172B", fontWeight: "bold", fontSize: 16 }}>
            Verificar
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
