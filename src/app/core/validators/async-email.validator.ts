import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';

export function emailDisponibleValidator(supabaseService: SupabaseService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return timer(400).pipe(
      switchMap(() => supabaseService.checkEmailRegistrado(control.value)),
      map(existe => (existe ? { emailDuplicado: true } : null)),
      catchError(() => of(null))
    );
  };
}