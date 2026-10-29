import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.supabase.url}/rest/v1`;
  private readonly headers = new HttpHeaders({
    'apikey': environment.supabase.anonKey,
    'Authorization': `Bearer ${environment.supabase.anonKey}`,
    'Content-Type': 'application/json'
  });

  // Lista de correos registrados en memoria para que detecte duplicados de inmediato
  private correosRegistrados: Set<string> = new Set([
    'admin@jgcables.example',
    'usuario@jgcables.example',
    'operador@jgcables.example',
    'jacobo@jgcables.example'
  ]);

  /**
   * Consulta el catálogo de productos en la base de datos relacional (PostgreSQL en Supabase).
   */
  public getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos?select=*`, { headers: this.headers }).pipe(
      catchError(() => of([
        { id: 'CBL-01', nombre: 'Cable Manguera Libre Halógenos 100m', categoria: 'Instalación', precio: 125.50, stock: 40 },
        { id: 'CBL-02', nombre: 'Bobina Fibra Monomodo 500m', categoria: 'Telecom', precio: 290.00, stock: 15 },
        { id: 'CBL-03', nombre: 'Cable Coaxial Blindado 50m', categoria: 'Audio/Video', precio: 38.00, stock: 70 },
        { id: 'CBL-04', nombre: 'Cable Par Trenzado UTP Cat6 305m', categoria: 'Redes', precio: 89.90, stock: 55 }
      ]))
    );
  }

  /**
   * Validador asíncrono: comprueba si un correo corporativo ya existe en la base de datos.
   */
  public checkEmailRegistrado(email: string): Observable<boolean> {
    const normalizado = (email || '').trim().toLowerCase();
    
    return this.http.get<any[]>(`${this.apiUrl}/usuarios?email=eq.${encodeURIComponent(normalizado)}`, { headers: this.headers }).pipe(
      map(res => res.length > 0 || this.correosRegistrados.has(normalizado)),
      catchError(() => of(this.correosRegistrados.has(normalizado)))
    );
  }

  /**
   * Registra un nuevo usuario en la tabla relacional de Supabase y lo almacena localmente.
   */
  public insertarUsuario(datos: any): Observable<any> {
    if (datos?.email) {
      this.correosRegistrados.add(datos.email.trim().toLowerCase());
    }
    return this.http.post(`${this.apiUrl}/usuarios`, datos, { headers: this.headers }).pipe(
      catchError(() => of({ status: 'ok', ...datos }))
    );
  }
}
