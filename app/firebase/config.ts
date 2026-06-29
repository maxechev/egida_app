import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // NUEVO: Importar Firestore

const firebaseConfig = {
  apiKey: 'AIzaSyBV5mUx2ACnObCspWUU8fUeOYhnsC44TWo',
  authDomain: 'egida-9edca.firebaseapp.com',
  projectId: 'egida-9edca',
  storageBucket: 'egida-9edca.firebasestorage.app',
  messagingSenderId: '426464460159',
  appId: '1:426464460159:web:b8e51f0f6cad39da7cae4a',
};

// Inicializar Firebase App
const app = initializeApp(firebaseConfig);

// Exportar servicios para usar en toda la app
export const auth = getAuth(app);
export const db = getFirestore(app); // NUEVO: Instancia de Firestore lista para usar