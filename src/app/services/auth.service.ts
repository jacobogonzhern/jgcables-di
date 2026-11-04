
import { Injectable, signal, computed } from '@angular/core';

export interface UserSession {
  username: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'DAM2_AUTH_SESSION';
  private _currentUser = signal<UserSession | null>(this.readSessionFromStorage());

  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => this._currentUser()?.isAuthenticated ?? false);
  
  // Selector computado útil para comprobar el rol activo de forma reactiva
  public userRole = computed(() => this._currentUser()?.role ?? null);

  public login(user: string, pass: string): boolean {
    let roleType: 'admin' | 'user' | null = null;

    // Validación según el rol requerido
    if (user === 'admin' && pass === '123') {
      roleType = 'admin';
    } else if (user === 'operador' && pass === '123') {
      roleType = 'user';
    }

    if (roleType) {
      const sessionData: UserSession = {
        username: user,
        role: roleType,
        isAuthenticated: true
      };
      this._currentUser.set(sessionData);
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      return true;
    }
    return false;
  }

  public logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this._currentUser.set(null);
  }

  private readSessionFromStorage(): UserSession | null {
    const rawData = sessionStorage.getItem(this.STORAGE_KEY);
    if (!rawData) return null;
    try {
      return JSON.parse(rawData) as UserSession;
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
}