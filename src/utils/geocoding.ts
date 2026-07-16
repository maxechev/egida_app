import * as Location from "expo-location";

export const getAddressFromCoords = async (
  lat: number,
  lng: number,
): Promise<string> => {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (!address) return "Ubicación desconocida";

    const calle = address.street || "";
    const numero = address.streetNumber || "";
    const barrio = address.subregion || address.city || "";

    return `${calle} ${numero}, ${barrio}`.trim().replace(/^,\s*/, "");
  } catch (error) {
    console.error("Error en geocodificación:", error);
    return "Error al obtener dirección";
  }
};
