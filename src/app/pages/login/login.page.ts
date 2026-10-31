import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonContent, IonInput, IonButton, IonIcon, LoadingController, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { gitNetworkOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule, RouterLink,
    IonContent, IonInput, IonButton, IonIcon
  ]
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  public loginForm!: FormGroup;

  constructor() {
    addIcons({ gitNetworkOutline });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /** Inicia sesión con Firebase y redirige según el rol del usuario. */
  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loader = await this.loadingCtrl.create({ message: 'Autenticando...' });
    await loader.present();

    const { email, password } = this.loginForm.value;

    try {
      const usuario = await this.auth.login(email, password);
      await loader.dismiss();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const destino = returnUrl ?? (usuario.rol === 'admin' ? '/dashboard' : '/pedidos');
      await this.router.navigateByUrl(destino, { replaceUrl: true });
    } catch (error) {
      await loader.dismiss();
      const toast = await this.toastCtrl.create({
        message: error instanceof Error ? error.message : 'No se pudo iniciar sesión.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
