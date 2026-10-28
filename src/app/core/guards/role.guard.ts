import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolUsuario } from '../models/user.model';
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rolRequerido = route.data?.['rol'] as RolUsuario;
  if (auth.isAuthenticated() && auth.hasRole(rolRequerido)) {
    return true;
  }
  return router.createUrlTree(['/pedidos']);
};