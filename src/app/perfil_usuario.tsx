import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PerfilUsuarioScreen() {
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={80} color="white" />
        </View>

        <View style={styles.infoContainer}>
          {params.alias ? (
            <>
              <Text style={styles.label}>Alias</Text>
              <Text style={styles.value}>{params.alias}</Text>
            </>
          ) : null}
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{params.nombre}</Text>

          <Text style={styles.label}>Apellido</Text>
          <Text style={styles.value}>{params.apellido}</Text>

          <Text style={styles.label}>Correo</Text>
          <Text style={styles.value}>{params.correo}</Text>

          <Text style={styles.label}>Contacto</Text>
          <Text style={styles.value}>{params.contacto}</Text>
        </View>

        <TouchableOpacity
          style={styles.btnMensaje}
          onPress={() =>
            router.push({
              pathname: "/chat",
              params: {
                usuarioId: params.id,
                nombre: params.alias || `${params.nombre} ${params.apellido}`,
              },
            })
          }
        >
          <Text style={styles.btnMensajeText}>Enviar mensaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10172B",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backIcon: {
    color: "white",
    fontSize: 30,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  infoContainer: {
    width: "100%",
    maxWidth: 350,
  },
  label: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 5,
    marginTop: 15,
  },
  value: {
    color: "white",
    fontSize: 16,
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 8,
  },
  btnMensaje: {
    backgroundColor: "#F0F0F2",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  btnMensajeText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});
