import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolUsuario } from '../models/user.model';

/** Solo deja pasar si el usuario tiene el rol indicado en `data.rol` de la ruta. */
export const roleGuard: CanActivateFn = async (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  const rolRequerido = route.data?.['rol'] as RolUsuario;

  if (auth.isAuthenticated() && auth.hasRole(rolRequerido)) {
    return true;
  }

  console.warn(`[RoleGuard] Acceso denegado a '${route.routeConfig?.path}'. Rol actual: '${auth.currentUser?.rol}'. Se requiere: '${rolRequerido}'. Redirigiendo...`);
  return router.createUrlTree(['/pedidos']);
};
