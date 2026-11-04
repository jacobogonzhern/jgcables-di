import { initializeApp } from 'firebase/app';
import { browserSessionPersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

/**
 * Inicialización única de Firebase (patrón singleton).
 * El resto de servicios importan `auth` y `db` desde aquí.
 */
export const firebaseApp = initializeApp(environment.firebase);

/**
 * Servicio de autenticación de Firebase (login por email y contraseña).
 * La sesión se guarda en sessionStorage: sobrevive a recargar la página,
 * pero se cierra al cerrar la pestaña del navegador.
 */
export const auth = initializeAuth(firebaseApp, { persistence: browserSessionPersistence });

/** Base de datos NoSQL Firestore (colecciones usuarios y pedidos). */
export const db = getFirestore(firebaseApp);
