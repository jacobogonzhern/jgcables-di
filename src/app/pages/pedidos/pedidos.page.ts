import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { documentTextOutline, downloadOutline } from 'ionicons/icons';

import { DataTableComponent } from '../../components/data-table/data-table.component';
import { FirebaseService, Pedido } from '../../core/services/firebase.service';
import { ExportService } from '../../core/services/export.service';

/** Fila de la tabla con los valores ya formateados para mostrar. */
interface FilaPedido {
  id: string;
  cliente: string;
  estado: string;
  total: string;
  fecha: string;
}

@Component({
  selector: 'app-pedidos',
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonSpinner,
    IonTitle,
    IonToolbar,
    DataTableComponent
  ],
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss']
})
export class PedidosPage implements OnInit {
  private readonly firebase = inject(FirebaseService);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);
  private readonly exportService = inject(ExportService);

  // Estado de la página con señales: la vista se actualiza sola al cambiar
  protected readonly pedidos = signal<Pedido[]>([]);
  protected readonly cargandoPedidos = signal(true);
  protected readonly errorPedidos = signal<string | null>(null);

  /** Pedidos preparados para la tabla (importe en euros y fecha en formato español). */
  protected readonly filas = computed<FilaPedido[]>(() =>
    this.pedidos().map(pedido => ({
      id: pedido.id,
      cliente: pedido.cliente,
      estado: pedido.estado,
      total: pedido.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
      fecha: pedido.fecha ? pedido.fecha.toLocaleDateString('es-ES') : ''
    }))
  );

  // Columnas que aparecerán en la tabla
  protected readonly columnas = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'estado', label: 'Estado' },
    { key: 'total', label: 'Total' },
    { key: 'fecha', label: 'Fecha' }
  ];

  constructor() {
    addIcons({ documentTextOutline, downloadOutline });
  }

  ngOnInit(): void {
    // Escucha en tiempo real: se cancela sola al destruir la página
    this.firebase.getPedidos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: pedidos => {
          this.pedidos.set(pedidos);
          this.cargandoPedidos.set(false);
          this.errorPedidos.set(null);
        },
        error: error => {
          console.error('Error al cargar pedidos de Firestore:', error);
          this.cargandoPedidos.set(false);
          this.errorPedidos.set('No se pudieron cargar los pedidos. Inténtalo de nuevo más tarde.');
        }
      });
  }

  // Ejecutar cuando se selecciona un pedido (evento emitido por la tabla)
  async onPedidoSelect(pedido: FilaPedido): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: `Pedido de ${pedido.cliente} · ${pedido.total} · ${pedido.estado}`,
      duration: 2500,
      color: 'primary'
    });
    await toast.present();
  }

  // Ejecutar cuando se realiza una búsqueda (evento emitido por la tabla)
  onSearchPedidos(termino: string): void {
    console.log('Buscando pedidos:', termino);
  }

  exportarPdf(): void {
    this.exportService.exportarPdf('Informe de pedidos', this.columnas, this.filas());
  }

  exportarCsv(): void {
    this.exportService.exportarCsv('Informe de pedidos', this.columnas, this.filas());
  }
}
