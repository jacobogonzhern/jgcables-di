import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

export function emailDisponibleValidator(supabaseService: SupabaseService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    // Breve debounce para la consulta
    return timer(300).pipe(
      switchMap(() => supabaseService.checkEmailRegistrado(control.value)),
      map(existe => {
        if (existe) {
          console.warn(`[Validación Asíncrona] El email '${control.value}' ya existe en la base de datos.`);
          return { emailDuplicado: true };
        }
        return null;
      }),
      catchError(error => {
        console.error('No se pudo comprobar el correo en Supabase:', error);
        return of({ emailCheckFailed: true });
      })
    );
  };
}
