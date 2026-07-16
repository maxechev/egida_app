// src/constants/urlApi.ts

// Configuración centralizada del backend
const LOCAL_IP = "192.168.1.21"; // Mi IP actual (cambiar si tu router la asigna diferente)
const PORT = 5285;

export const API_URL = __DEV__
  ? `http://${LOCAL_IP}:${PORT}/api`
  : "https://egida-api.tudominio.com/api"; // URL de producción futura

// Endpoints específicos para evitar strings hardcodeados en pantallas
//export const ENDPOINTS = {
//  AUTH: {
//    REGISTER: `${API_URL}/Auth/register`,
//    LOGIN: `${API_URL}/Auth/login`,
//    VERIFY_EMAIL: `${API_URL}/Auth/verify-email`,
//  },
//  ALERTAS: `${API_URL}/Alertas`,
//  REDES: `${API_URL}/Redes`,
//  PERFIL: `${API_URL}/Perfil`,
//} as const;

//
