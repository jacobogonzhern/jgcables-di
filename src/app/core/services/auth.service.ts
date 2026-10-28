import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario, RolUsuario } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  public user$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor() {
    const sesion = localStorage.getItem('jgcables_sesion');
    if (sesion) {
      try {
        this.userSubject.next(JSON.parse(sesion));
      } catch {
        localStorage.removeItem('jgcables_sesion');
      }
    }
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

  public loginUser(user: Usuario): void {
    localStorage.setItem('jgcables_sesion', JSON.stringify(user));
    this.userSubject.next(user);
  }

  public logout(): void {
    localStorage.removeItem('jgcables_sesion');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}