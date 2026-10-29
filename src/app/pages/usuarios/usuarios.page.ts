import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UsuariosPage {}
 export type RolUsuario = 'admin' | 'usuario';
  export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  token?: string;
}
