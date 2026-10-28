import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonLabel, IonInput, IonButton, LoadingController, ToastController
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    IonLabel, IonInput, IonButton
  ]
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  public loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async login() {
    if (this.loginForm.invalid) return;

    const loader = await this.loadingCtrl.create({ message: 'Autenticando...' });
    await loader.present();

    const { email, password } = this.loginForm.value;

    setTimeout(async () => {
      await loader.dismiss();
      if (email === 'admin@jgcables.example' && password === 'Admin123!') {
        this.auth.loginUser({
          uid: 'adm-001',
          email,
          nombre: 'Administrador General',
          rol: 'admin',
          token: 'token-admin-simulado'
        });
        this.router.navigate(['/dashboard']);
      } else if (email === 'usuario@jgcables.example' && password === 'User123!') {
        this.auth.loginUser({
          uid: 'usr-002',
          email,
          nombre: 'Operador Estándar',
          rol: 'usuario',
          token: 'token-usuario-simulado'
        });
        this.router.navigate(['/pedidos']);
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Credenciales inválidas. Usa las cuentas de prueba.',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    }, 500);
  }
}