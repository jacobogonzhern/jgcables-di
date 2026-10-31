
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular';

import { DataTableComponent } from
  '../../components/metric-card/data-table.component';
import { FirebaseService, Pedido } from '../../core/services/firebase.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    DataTableComponent
  ],
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss']
})
export class PedidosPage implements OnInit, OnDestroy {
  private readonly firebase = inject(FirebaseService);
  private readonly pedidosSubscription = new Subscription();
  pedidos: Pedido[] = [];
  cargandoPedidos = true;
  errorPedidos: string | null = null;

  // Columnas que aparecerán en la tabla
  columnas = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'producto', label: 'Producto' },
    { key: 'precio', label: 'Precio (€)' },
    { key: 'estado', label: 'Estado' }
  ];

  ngOnInit(): void {
    this.pedidosSubscription.add(
      this.firebase.getPedidos().subscribe({
        next: pedidos => {
          this.pedidos = pedidos;
          this.cargandoPedidos = false;
          this.errorPedidos = null;
        },
        error: error => {
          console.error('Error al cargar pedidos de Firestore:', error);
          this.cargandoPedidos = false;
          this.errorPedidos = 'No se pudieron cargar los pedidos. Inténtalo de nuevo más tarde.';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.pedidosSubscription.unsubscribe();
  }

  // Ejecutar cuando se selecciona un pedido
  onPedidoSelect(pedido: Pedido): void {

    console.log('Pedido seleccionado:', pedido);

    alert(
      'Pedido seleccionado: ' +
      pedido.id +
      '\nCliente: ' +
      (pedido.cliente ?? '') +
      '\nProducto: ' +
      (pedido.producto ?? '')
    );

  }

  // Ejecutar cuando se realiza una búsqueda
  onSearchPedidos(termino: string): void {

    console.log('Buscando pedidos:', termino);

  }

}