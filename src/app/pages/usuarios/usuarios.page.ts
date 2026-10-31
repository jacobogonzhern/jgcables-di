import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonButtons, IonContent, IonHeader, IonMenuButton, IonSpinner, IonTitle, IonToolbar
} from '@ionic/angular';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { SupabaseService, UsuarioRegistro } from '../../core/services/supabase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  imports: [
    IonButtons, IonContent, IonHeader, IonMenuButton, IonSpinner, IonTitle, IonToolbar,
    DataTableComponent
  ]
})
export class UsuariosPage implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly usuarios = signal<UsuarioRegistro[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  // Reutilizo el mismo componente de tabla que en Pedidos, solo cambian las columnas
  protected readonly columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Correo electrónico' }
  ];

  ngOnInit(): void {
    this.supabase.getUsuarios()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: usuarios => {
          this.usuarios.set(usuarios);
          this.cargando.set(false);
        },
        error: err => {
          console.error('Error al cargar usuarios:', err);
          this.error.set('No se pudieron cargar los usuarios.');
          this.cargando.set(false);
        }
      });
  }
}
