import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/user.model';

describe('roleGuard', () => {
  let usuarioActual: Usuario | null;

  beforeEach(() => {
    usuarioActual = null;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            ready: Promise.resolve(),
            isAuthenticated: () => usuarioActual !== null,
            hasRole: (rol: string) => usuarioActual?.rol === rol,
            get currentUser() { return usuarioActual; }
          }
        }
      ]
    });
  });

  function comprobar(rol: 'admin' | 'usuario') {
    return TestBed.runInInjectionContext(() =>
      roleGuard(rol)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  function rutaDe(resultado: unknown): string {
    return TestBed.inject(Router).serializeUrl(resultado as UrlTree);
  }

  it('deja pasar a un administrador a una ruta de administrador', async () => {
    usuarioActual = { uid: '1', email: 'admin@jgcables.com', nombre: 'Admin', rol: 'admin' };
    expect(await comprobar('admin')).toBe(true);
  });

  it('redirige a un usuario estándar a /user-dashboard', async () => {
    usuarioActual = { uid: '2', email: 'usuario@jgcables.com', nombre: 'Usuario', rol: 'usuario' };
    expect(rutaDe(await comprobar('admin'))).toBe('/user-dashboard');
  });

  it('redirige al login si no hay sesión', async () => {
    expect(rutaDe(await comprobar('admin'))).toBe('/login');
  });
});
