import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function AlertaScreen() {
  const [motivo, setMotivo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEnviarAlerta = async () => {
    if (!motivo) {
      Alert.alert("Error", "Por favor seleccione un motivo antes de enviar.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Obtener token
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("No hay sesión activa.");

      // 2. Decodificar token para obtener userId
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = parseInt(
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
      );

      // 3. Obtener geolocalización
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted")
        throw new Error("Permiso de ubicación requerido.");

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 4. Calcular dirección
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const direccionTexto = address
        ? `${address.street || ""} ${address.streetNumber || ""}, ${address.city || address.subregion || ""}`.trim()
        : "Ubicación desconocida";

      // 5. Enviar a la API
      const response = await fetch("http://192.168.1.10:5285/api/Alerta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo: motivo,
          mensaje: motivo, // Usamos el mismo motivo como mensaje
          ubicacion: direccionTexto,
          fecha: new Date().toISOString(),
          latitud: location.coords.latitude,
          longitud: location.coords.longitude,
          usuarioId: userId,
          estado: "En proceso",
          redId: 1, // ID de la red (ajustar si es diferente)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al enviar alerta");
      }

      console.log(`✅ Alerta enviada: ${motivo} | 📍 ${direccionTexto}`);
      router.replace("/home");
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      Alert.alert("Error", error.message || "No se pudo enviar la alerta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#10172B" }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => !isLoading && router.back()}
            style={{ marginRight: 15 }}
          >
            <Text style={{ color: "white", fontSize: 28 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
            Nueva Alerta
          </Text>
        </View>

        {/* Selector */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Picker
            selectedValue={motivo}
            onValueChange={(v) => setMotivo(v)}
            enabled={!isLoading}
          >
            <Picker.Item label="Seleccione el motivo" value="" />
            <Picker.Item label="Robo" value="Robo" />
            <Picker.Item
              label="Secuestro de vehículo"
              value="Secuestro de vehículo"
            />
            <Picker.Item label="Allanamiento" value="Allanamiento" />
            <Picker.Item label="Secuestro" value="Secuestro" />
            <Picker.Item
              label="Actividad sospechosa"
              value="Actividad sospechosa"
            />
            <Picker.Item
              label="Disparos de arma de fuego"
              value="Disparos de arma de fuego"
            />
          </Picker>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={{
            backgroundColor: isLoading ? "#CC3333" : "#FF4444",
            width: "100%",
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            marginTop: "auto",
            marginBottom: 20,
            opacity: isLoading ? 0.8 : 1,
          }}
          onPress={handleEnviarAlerta}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 18 }}>
              ENVIAR ALERTA
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
