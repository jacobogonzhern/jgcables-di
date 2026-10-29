import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin, take } from 'rxjs';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/angular';
import { MetricCardComponent } from
  '../../components/metric-card/metric-card.component';
import { FirebaseService, Pedido } from '../../core/services/firebase.service';
import { Cliente, SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
    MetricCardComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly firebaseService = inject(FirebaseService);

  clientes: Cliente[] = [];
  pedidos: Pedido[] = [];
  loading = false;
  errorToastOpen = false;
  readonly errorToastMessage = 'Error al sincronizar con los servicios de datos';

  totalPedidos = 0;
  totalClientes = 0;
  ingresos = 0;
  pedidosPendientes = 0;

  ngOnInit(): void {
    this.cargarDatosCombinados();
  }

  cargarDatosCombinados(): void {
    this.loading = true;
    this.errorToastOpen = false;

    forkJoin({
      datosSql: this.supabaseService.getClientes(),
      datosNoSql: this.firebaseService.getPedidos().pipe(take(1))
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ({ datosSql, datosNoSql }) => {
        this.clientes = datosSql;
        this.pedidos = datosNoSql;
        this.totalClientes = datosSql.length;
        this.totalPedidos = datosNoSql.length;
        this.ingresos = datosNoSql.reduce(
          (total, pedido) => total + (Number(pedido.precio) || 0),
          0
        );
        this.pedidosPendientes = datosNoSql.filter(
          pedido => pedido.estado?.toLocaleLowerCase() === 'pendiente'
        ).length;
      },
      error: error => {
        console.error('Error al sincronizar con los servicios de datos:', error);
        this.errorToastOpen = true;
      }
    });
  }

  // Método ejecutado al pulsar una tarjeta
  onMetricCardClick(metric: string): void {

    console.log('Tarjeta seleccionada:', metric);

  }

}