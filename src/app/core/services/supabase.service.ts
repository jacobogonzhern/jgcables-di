import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Producto {
  id: string | number;
  nombre: string;
  categoria?: string;
  precio: number;
  stock: number;
}

export interface Cliente {
  id: string | number;
  nombre: string;
  email?: string;
  telefono?: string;
}

export interface UsuarioRegistro {
  nombre: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.supabase.url}/rest/v1`;
  private readonly headers = new HttpHeaders({
    apikey: environment.supabase.anonKey,
    Authorization: `Bearer ${environment.supabase.anonKey}`,
    'Content-Type': 'application/json'
  });

  public getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos?select=*`, {
      headers: this.headers
    });
  }

  public getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes?select=*`, {
      headers: this.headers
    });
  }

  public checkEmailRegistrado(email: string): Observable<boolean> {
    const normalizado = email.trim().toLowerCase();
    const url = `${this.apiUrl}/usuarios?select=email&email=eq.${encodeURIComponent(normalizado)}`;

    return this.http.get<Array<{ email: string }>>(url, {
      headers: this.headers
    }).pipe(map(usuarios => usuarios.length > 0));
  }

  public insertarUsuario(datos: UsuarioRegistro): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/usuarios`, datos, {
      headers: this.headers.set('Prefer', 'return=representation')
    });
  }
}
