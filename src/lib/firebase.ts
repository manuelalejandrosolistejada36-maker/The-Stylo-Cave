// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase, ref, set, get, push, update, remove } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpArA4AoxU-tKt4is5QWIlFQIMnCFxb7E",
  authDomain: "thestylocave.firebaseapp.com",
  projectId: "thestylocave",
  storageBucket: "thestylocave.firebasestorage.app",
  messagingSenderId: "882440564974",
  appId: "1:882440564974:web:4a2b957db071eb0b5c83ff",
  measurementId: "G-JK8P3D2CVS",
  databaseURL: "https://thestylocave-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only if supported (browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

const database = getDatabase(app);
const storage = getStorage(app);

// Exportar instancias para usar en toda la aplicación
export { app, analytics, database, storage, ref, set, get, push, update, remove };

// Funciones auxiliares para trabajar con reservas
export const saveReservation = async (data: any) => {
  try {
    console.log('📝 Intentando guardar reserva:', data);
    
    const newReservationRef = push(ref(database, "reservations"));
    console.log('🔑 Referencia de reserva creada:', newReservationRef.key);
    
    await set(newReservationRef, {
      ...data,
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Reserva guardada exitosamente con ID:', newReservationRef.key);
    return newReservationRef.key;
  } catch (error: any) {
    console.error("❌ Error al guardar reserva:", error);
    console.error("Código de error:", error.code);
    console.error("Mensaje de error:", error.message);
    throw new Error(`No se pudo guardar la reserva: ${error.message}`);
  }
};

export const getReservations = async () => {
  try {
    console.log('📖 Obteniendo reservaciones...');
    const reservationsRef = ref(database, "reservations");
    const snapshot = await get(reservationsRef);
    
    if (snapshot.exists()) {
      console.log('✅ Reservas encontradas:', snapshot.val());
      return snapshot.val();
    }
    console.log('⚠️ No hay reservas en la base de datos');
    return null;
  } catch (error: any) {
    console.error("❌ Error al obtener reservas:", error);
    throw error;
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    await remove(ref(database, `reservations/${reservationId}`));
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    throw error;
  }
};