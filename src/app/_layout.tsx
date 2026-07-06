import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="alerta" />
      <Stack.Screen name="alertaopc" />
      <Stack.Screen name="autenticar_codigo" />
      <Stack.Screen name="comunidad" />
      <Stack.Screen name="config-gestos" />
      <Stack.Screen name="config-notificaciones" />
      <Stack.Screen name="config-sonido" />
      <Stack.Screen name="contacto" />
      <Stack.Screen name="email-verified" />
      <Stack.Screen name="emergencias" />
      <Stack.Screen name="gestos" />
      <Stack.Screen name="home" />
      <Stack.Screen name="index" />
      <Stack.Screen name="modal" />
      <Stack.Screen name="opciones" />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="privacidad" />
      <Stack.Screen name="recuperar-contrasenia" />
      <Stack.Screen name="solicitar-recuperacion" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
}