const LOCAL_IP = "10.13.18.105";
const PORT = 5285;

export const API_URL = __DEV__
  ? `http://${LOCAL_IP}:${PORT}/api`
  : "https://egida-api.tudominio.com/api";
