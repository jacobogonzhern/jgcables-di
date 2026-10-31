import { Injectable } from '@angular/core';
import { Timestamp, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from '../firebase';

/** Pedido guardado en la colección `pedidos` de Firestore. */
export interface Pedido {
  id: string;
  cliente: string;
  estado: string;
  total: number;
  fecha: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  /**
   * Escucha la colección `pedidos` en tiempo real.
   * Al cancelar la suscripción se cierra la escucha (evita fugas de memoria).
   */
  public getPedidos(): Observable<Pedido[]> {
    return new Observable<Pedido[]>(subscriber => {
      const consulta = query(collection(db, 'pedidos'), orderBy('fecha', 'desc'));
      const unsubscribe = onSnapshot(
        consulta,
        snapshot => {
          subscriber.next(snapshot.docs.map(documento => {
            const datos = documento.data();
            return {
              id: documento.id,
              cliente: String(datos['cliente'] ?? ''),
              estado: String(datos['estado'] ?? ''),
              total: Number(datos['total'] ?? 0),
              fecha: datos['fecha'] instanceof Timestamp ? datos['fecha'].toDate() : null
            };
          }));
        },
        error => subscriber.error(error)
      );

      return unsubscribe;
    });
  }
}
