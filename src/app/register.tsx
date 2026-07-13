import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/imagePath";
import { API_URL } from '../constants/urlApi';

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [claveRed, setClaveRed] = useState("");
  const [alias, setAlias] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isAgeValid = (date: Date): boolean => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age >= 13;
  };

  const register = async () => {
    // Validaciones
    if (
      !nombre ||
      !apellido ||
      !telefono ||
      !email ||
      !password ||
      !alias ||
      !claveRed
    ) {
      Alert.alert("Error", "Complete todos los campos obligatorios.");
      return;
    }
    if (!selectedDate || !isAgeValid(selectedDate)) {
      Alert.alert(
        "Error",
        "Debes tener al menos 13 años para registrarte en Égida.",
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          correo: email,
          contacto: telefono,
          contrasena: password,
          dni: dni || null,
          ocupacion: ocupacion || null,
          fechaNacimiento: selectedDate
            ? selectedDate.toISOString().split("T")[0]
            : null,
          alias: alias,
          claveRed: claveRed,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.mensaje || "Error al registrarse");
        return;
      }
      // Guardar la red a la que se unió como red activa
      if (data.redId) {
        await SecureStore.setItemAsync("redActivaId", data.redId.toString());
      }

      // Guardar correo para la siguiente pantalla
      await SecureStore.setItemAsync("pendingVerificationEmail", email);

      // Navegar a verificación
      router.replace("/verify-email");
    } catch (error: any) {
      console.error("Error en registro:", error);
      Alert.alert("Error", "Ocurrió un error al registrarse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Image
        source={images.logoEgida}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        editable={!isLoading}
      />
      <TextInput
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        editable={!isLoading}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.halfInput}
          editable={!isLoading}
        />
        <TextInput
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
          style={styles.halfInput}
          editable={!isLoading}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          style={styles.halfInput}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
        <TextInput
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
          style={styles.halfInput}
          keyboardType="numeric"
          maxLength={8}
          editable={!isLoading}
        />
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.halfInput, styles.dateButton]}
          onPress={() => !isLoading && setShowDatePicker(true)}
          disabled={isLoading}
        >
          <Text style={{ color: selectedDate ? "#000" : "#999", fontSize: 14 }}>
            {selectedDate ? formatDate(selectedDate) : "Fecha nacim."}
          </Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Ocupación"
          value={ocupacion}
          onChangeText={setOcupacion}
          style={styles.halfInput}
          editable={!isLoading}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="Alias"
          value={alias}
          onChangeText={setAlias}
          style={styles.halfInput}
          editable={!isLoading}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Clave de red"
          value={claveRed}
          onChangeText={setClaveRed}
          style={styles.halfInput}
          editable={!isLoading}
          autoCapitalize="none"
        />
      </View>

      {showDatePicker && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate || new Date(2005, 0, 1)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  if (event.type === "dismissed") setShowDatePicker(false);
                  else if (date) {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }
                }}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                textColor="#000"
                accentColor="#10172B"
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={register}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creando..." : "Crear cuenta"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10172B",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
    zIndex: 10,
    padding: 10,
  },
  backArrow: { color: "white", fontSize: 30, fontWeight: "bold" },
  logo: { width: 140, height: 140, marginBottom: 10 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 25 },
  input: {
    backgroundColor: "#F0F0F2",
    width: "100%",
    maxWidth: 320,
    height: 45,
    marginBottom: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    fontSize: 15,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    width: "100%",
    maxWidth: 320,
    justifyContent: "space-between",
  },
  halfInput: {
    backgroundColor: "#F0F0F2",
    width: "48%",
    height: 45,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 14,
    color: "#000",
  },
  dateButton: { justifyContent: "center", alignItems: "flex-start" },
  button: {
    backgroundColor: "#F0F0F2",
    width: 150,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    borderRadius: 6,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontWeight: "bold", fontSize: 16, color: "#10172B" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "85%",
    maxWidth: 350,
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#10172B",
    borderRadius: 6,
  },
  modalCloseText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
