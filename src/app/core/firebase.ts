import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

/**
 * Inicialización única de Firebase (patrón singleton).
 * El resto de servicios importan `auth` y `db` desde aquí.
 */
export const firebaseApp = initializeApp(environment.firebase);

/** Servicio de autenticación de Firebase (login por email y contraseña). */
export const auth = getAuth(firebaseApp);

/** Base de datos NoSQL Firestore (colecciones usuarios y pedidos). */
export const db = getFirestore(firebaseApp);
