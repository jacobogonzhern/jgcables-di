import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonInput, IonButton, IonSpinner, IonIcon, LoadingController, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { gitNetworkOutline } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { emailDisponibleValidator } from '../../core/validators/async-email.validator';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    IonContent, IonInput, IonButton, IonSpinner, IonIcon
  ]
})
export class RegisterPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  public registerForm!: FormGroup;

  constructor() {
    addIcons({ gitNetworkOutline });
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [emailDisponibleValidator(this.supabase)],
        updateOn: 'change'
      }),
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // La app funciona sin Zone.js: cuando termina la validación asíncrona
    // se avisa a Angular para que repinte el estado (comprobando / error / válido).
    this.email.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

  get email(): AbstractControl {
    return this.registerForm.controls['email'];
  }

  async registrar() {
    if (this.registerForm.invalid || this.registerForm.pending) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const loader = await this.loadingCtrl.create({ message: 'Registrando usuario...' });
    await loader.present();

    const { nombre, email, password } = this.registerForm.value;

    try {
      // 1. La cuenta y la contraseña las gestiona Firebase Authentication (nunca se guardan en texto plano).
      await this.auth.registrar(nombre, email, password);
      // 2. Se guarda el email (sin contraseña) en Supabase para la validación asíncrona de duplicados.
      await firstValueFrom(this.supabase.insertarUsuario({ nombre, email }));

      await loader.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Usuario dado de alta correctamente. Ya puedes iniciar sesión.',
        duration: 2500,
        color: 'success'
      });
      await toast.present();
      await this.router.navigate(['/login']);
    } catch (error) {
      await loader.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Error al registrar: ' + (error instanceof Error ? error.message : 'inténtalo de nuevo.'),
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
