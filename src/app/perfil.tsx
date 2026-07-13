import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contacto: "",
    alias: "",
  });
  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(
        "http://192.168.1.10:5285/api/Perfil/mi-perfil",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setDatos({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          contacto: data.contacto,
          alias: data.alias,
        });
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#10172B",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          left: 20,
          top: 50,
        }}
        onPress={() => router.back()}
      >
        <Text
          style={{
            color: "white",
            fontSize: 30,
          }}
        >
          ←
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 60,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "#F0F0F2",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 70 }}>👤</Text>
      </View>

      <View
        style={{
          marginTop: 15,
          gap: 10,
        }}
      >
        <View style={styles.box}>
          <Text>{datos.nombre}</Text>
        </View>

        <View style={styles.box}>
          <Text>{datos.apellido}</Text>
        </View>

        <View style={styles.box}>
          <Text>{datos.correo}</Text>
        </View>

        <View style={styles.box}>
          <Text>{datos.contacto}</Text>
        </View>

        <View style={styles.box}>
          <Text>{datos.alias}</Text>
        </View>

        <TouchableOpacity
          style={{
            ...styles.box,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.push("/privacidad")}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Privacidad
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  box: {
    backgroundColor: "#F0F0F2",
    width: 180,
    height: 35,
    justifyContent: "center" as const,
    paddingHorizontal: 10,
  },
};
