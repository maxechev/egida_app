import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificamos si existe un token guardado
        const token = await SecureStore.getItemAsync("token");
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error verificando sesión:", error);
        setIsLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Mientras verifica, no mostramos nada
  if (isChecking) {
    return null;
  }

  // Si hay token, va al home. Si no, va al login.
  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
