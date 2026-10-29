import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonLabel, IonInput, IonButton, IonSpinner,
  IonButtons, IonBackButton, LoadingController, ToastController
} from '@ionic/angular';
import { emailDisponibleValidator } from '../../core/validators/async-email.validator';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    IonLabel, IonInput, IonButton, IonSpinner,
    IonButtons, IonBackButton
  ]
})
export class RegisterPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  public registerForm!: FormGroup;

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

    this.supabase.insertarUsuario(this.registerForm.value).subscribe({
      next: async () => {
        await loader.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Usuario dado de alta satisfactoriamente.',
          duration: 2500,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await loader.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Error al registrar: ' + err.message,
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
