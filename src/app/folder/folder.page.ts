import { Component, OnInit, inject, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { firebaseApp } from '../core/firebase';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent],
})
export class FolderPage implements OnInit {
  readonly folder = input.required<string>();
  private readonly http = inject(HttpClient);

  // PRUEBA TEMPORAL (Paso 2): comprobar conexión con Supabase y Firebase.
  // Se sustituirá por servicios reales en el Paso 6.
  ngOnInit(): void {
    console.log('✅ Firebase inicializado:', firebaseApp.options.projectId);

    this.http
      .get(`${environment.supabase.url}/rest/v1/productos?select=*`, {
        headers: { apikey: environment.supabase.anonKey },
      })
      .subscribe({
        next: (datos) => console.log('✅ Supabase OK', datos),
        error: (err) => console.error('❌ Error Supabase', err),
      });
  }
}
