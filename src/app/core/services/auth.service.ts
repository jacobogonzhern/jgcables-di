import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { auth, db } from '../firebase';
import { RolUsuario, Usuario } from '../models/user.model';

/**
 * Servicio de autenticación con Firebase Authentication.
 * El rol de cada usuario se lee de Firestore (colección `usuarios`).
 * Además, la sesión se guarda en sessionStorage (Web Storage API) para que
 * no se pierda al recargar la página. Esa copia solo sirve para mostrar la
 * interfaz al instante: los guards esperan siempre a que Firebase confirme
 * la sesión, así que modificar el sessionStorage a mano no da acceso a nada.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);

  /** Clave usada en sessionStorage para guardar la sesión. */
  private readonly STORAGE_KEY = 'JGCABLES_SESION';

  /** Estado en memoria. Al arrancar se recupera lo guardado en sessionStorage. */
  private readonly userSubject = new BehaviorSubject<Usuario | null>(this.leerSesionGuardada());

  /** Usuario actual como flujo reactivo (lo usa el menú con el pipe async). */
  public readonly user$: Observable<Usuario | null> = this.userSubject.asObservable();

  /** Se resuelve cuando Firebase ha comprobado si había una sesión guardada. */
  public readonly ready: Promise<void>;

  constructor() {
    this.ready = new Promise<void>(resolve => {
      onAuthStateChanged(auth, async firebaseUser => {
        try {
          this.guardarSesion(firebaseUser ? await this.cargarPerfil(firebaseUser) : null);
        } catch (error) {
          console.error('[Auth] No se pudo cargar el perfil del usuario:', error);
          this.guardarSesion(null);
        }
        resolve();
      });
    });
  }

  public get currentUser(): Usuario | null {
    return this.userSubject.value;
  }

  public isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  public hasRole(rol: RolUsuario): boolean {
    return this.userSubject.value?.rol === rol;
  }

  /**
   * Inicia sesión con Firebase y carga el rol desde Firestore.
   * @throws Error con un mensaje en español si las credenciales no son válidas.
   */
  public async login(email: string, password: string): Promise<Usuario> {
    try {
      const credencial = await signInWithEmailAndPassword(auth, email.trim(), password);
      const usuario = await this.cargarPerfil(credencial.user);
      this.guardarSesion(usuario);
      return usuario;
    } catch (error) {
      throw new Error(this.traducirError(error));
    }
  }

  /**
   * Crea la cuenta en Firebase y su perfil en Firestore con rol "usuario".
   * Después cierra la sesión para que el usuario entre desde el login.
   */
  public async registrar(nombre: string, email: string, password: string): Promise<void> {
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'usuarios', credencial.user.uid), {
        nombre,
        email: email.trim().toLowerCase(),
        rol: 'usuario'
      });
      await signOut(auth);
      this.guardarSesion(null);
    } catch (error) {
      throw new Error(this.traducirError(error));
    }
  }

  public async logout(): Promise<void> {
    await signOut(auth);
    this.guardarSesion(null);
    await this.router.navigate(['/login']);
  }

  /** Actualiza la sesión en memoria y en sessionStorage (o la borra si es null). */
  private guardarSesion(usuario: Usuario | null): void {
    if (usuario) {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
    this.userSubject.next(usuario);
  }

  /** Recupera la sesión guardada al recargar la página. */
  private leerSesionGuardada(): Usuario | null {
    const datos = sessionStorage.getItem(this.STORAGE_KEY);
    if (!datos) {
      return null;
    }
    try {
      return JSON.parse(datos) as Usuario;
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  /** Lee el nombre y el rol del usuario en Firestore (`usuarios/{uid}`). */
  private async cargarPerfil(user: User): Promise<Usuario> {
    const snapshot = await getDoc(doc(db, 'usuarios', user.uid));
    const datos = snapshot.data() ?? {};
    return {
      uid: user.uid,
      email: user.email ?? '',
      nombre: String(datos['nombre'] ?? ''),
      rol: datos['rol'] === 'admin' ? 'admin' : 'usuario'
    };
  }

  /** Convierte los códigos de error de Firebase en mensajes comprensibles. */
  private traducirError(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return 'Correo o contraseña incorrectos.';
        case 'auth/email-already-in-use':
          return 'Ya existe una cuenta con ese correo.';
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres.';
        case 'auth/too-many-requests':
          return 'Demasiados intentos. Espera unos minutos.';
        case 'auth/network-request-failed':
          return 'Sin conexión. Revisa tu red.';
      }
    }
    return 'Se ha producido un error. Inténtalo de nuevo.';
  }
}
