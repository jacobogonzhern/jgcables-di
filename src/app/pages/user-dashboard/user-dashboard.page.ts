import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonButtons, IonButton, IonIcon, IonMenuButton
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonButtons, IonButton, IonIcon, IonMenuButton,
    MetricCardComponent
  ]
})
export class UserDashboardPage {
  public readonly auth = inject(AuthService);
  private authService = this.auth;
  private router = inject(Router);
  private readonly pedidos = toSignal(inject(FirebaseService).getPedidos(), { initialValue: [] });

  protected readonly totalPedidos = computed(() => this.pedidos().length);
  protected readonly pendientes = computed(() => this.pedidos().filter(p => p.estado === 'pendiente').length);
  protected readonly entregados = computed(() => this.pedidos().filter(p => p.estado === 'entregado').length);

  public irA(ruta: string): void {
    this.router.navigate([ruta]);
  }
  
  public currentSession = this.authService.currentUser;

  public handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}