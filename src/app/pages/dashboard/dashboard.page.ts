import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonSelect, IonSelectOption,
  IonSpinner, IonTitle, IonToast, IonToolbar
} from '@ionic/angular';
import { ChartComponent } from '../../components/chart/chart.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { FirebaseService, Pedido } from '../../core/services/firebase.service';
import { Cliente, SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonSelect, IonSelectOption,
    IonSpinner, IonTitle, IonToast, IonToolbar,
    MetricCardComponent, ChartComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly firebaseService = inject(FirebaseService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly errorToastOpen = signal(false);
  protected readonly errorToastMessage = signal('');

  private readonly clientes = signal<Cliente[]>([]);
  private readonly pedidos = signal<Pedido[]>([]);

  /** Filtro por estado, enlazado en dos direcciones con [(ngModel)]. */
  protected readonly filtroEstado = signal('todos');

  private readonly pedidosFiltrados = computed(() =>
    this.filtroEstado() === 'todos'
      ? this.pedidos()
      : this.pedidos().filter(p => p.estado === this.filtroEstado())
  );

  // Indicadores: se recalculan solos al cambiar los datos o el filtro
  protected readonly totalPedidos = computed(() => this.pedidosFiltrados().length);
  protected readonly totalClientes = computed(() => this.clientes().length);
  protected readonly ingresos = computed(() =>
    this.pedidosFiltrados()
      .reduce((suma, p) => suma + p.total, 0)
      .toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
  );
  protected readonly pedidosPendientes = computed(() =>
    this.pedidos().filter(p => p.estado === 'pendiente').length
  );

  // Datos de los gráficos
  protected readonly estados = ['pendiente', 'enviado', 'entregado'];
  protected readonly pedidosPorEstado = computed(() =>
    this.estados.map(e => this.pedidos().filter(p => p.estado === e).length)
  );
  protected readonly facturacionPorCliente = computed(() => {
    const mapa = new Map<string, number>();
    for (const p of this.pedidosFiltrados()) {
      mapa.set(p.cliente, (mapa.get(p.cliente) ?? 0) + p.total);
    }
    return { labels: [...mapa.keys()], values: [...mapa.values()] };
  });

  ngOnInit(): void {
    this.cargarDatosCombinados();
  }

  /**
   * Orquestación asíncrona de las dos fuentes: clientes (SQL, Supabase) y pedidos
   * (NoSQL, Firestore). combineLatest vuelve a emitir cada vez que cambia un pedido,
   * así que el dashboard se actualiza en tiempo real.
   */
  cargarDatosCombinados(): void {
    this.loading.set(true);
    this.loadError.set(false);

    combineLatest([this.supabaseService.getClientes(), this.firebaseService.getPedidos()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([clientes, pedidos]) => {
          this.clientes.set(clientes);
          this.pedidos.set(pedidos);
          this.loading.set(false);
        },
        error: error => {
          console.error('Error al sincronizar con los servicios de datos:', error);
          this.loading.set(false);
          this.loadError.set(true);
          this.errorToastMessage.set('Error al sincronizar con los servicios de datos. Inténtalo de nuevo.');
          this.errorToastOpen.set(true);
        }
      });
  }

  reintentarCarga(): void {
    this.cargarDatosCombinados();
  }

  // Al pulsar un sector del gráfico de estados se aplica ese filtro (evento del componente hijo)
  filtrarPorEstado(estado: string): void {
    this.filtroEstado.set(this.filtroEstado() === estado ? 'todos' : estado);
  }

  onMetricCardClick(metric: string): void {
    if (metric === 'pedidos' || metric === 'pendientes') {
      this.router.navigate(['/pedidos']);
    }
  }
}