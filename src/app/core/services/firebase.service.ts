import { Injectable } from '@angular/core';
import { collection, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from '../firebase';

export interface Pedido {
  id: string;
  cliente?: string;
  producto?: string;
  precio?: number;
  estado?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public getPedidos(): Observable<Pedido[]> {
    return new Observable<Pedido[]>(subscriber => {
      const pedidosRef = collection(db, 'pedidos');
      const unsubscribe = onSnapshot(
        pedidosRef,
        snapshot => {
          subscriber.next(snapshot.docs.map(document => ({
            ...document.data(),
            id: document.id
          })));
        },
        error => subscriber.error(error)
      );

      return unsubscribe;
    });
  }
}
