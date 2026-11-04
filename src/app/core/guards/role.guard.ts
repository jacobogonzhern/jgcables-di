import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolUsuario } from '../models/user.model';

/**
 * Factoría de guards: devuelve un guard que solo deja pasar al rol indicado.
 * Uso en las rutas: canActivate: [authGuard, roleGuard('admin')]
 * Si un usuario estándar intenta entrar en una ruta de administrador,
 * se le redirige a su panel (/user-dashboard).
 */
export function roleGuard(rolPermitido: RolUsuario): CanActivateFn {
  return async (route) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    await auth.ready;

    if (auth.hasRole(rolPermitido)) {
      return true;
    }

    console.warn(`[RoleGuard] Acceso denegado a '${route.routeConfig?.path}'. Rol actual: '${auth.currentUser?.rol}'. Se requiere: '${rolPermitido}'. Redirigiendo...`);
    return router.createUrlTree([auth.isAuthenticated() ? '/user-dashboard' : '/login']);
  };
}
