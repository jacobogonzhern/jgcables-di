import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { Usuario } from './core/models/user.model';

describe('AppComponent', () => {
  let user$: BehaviorSubject<Usuario | null>;

  beforeEach(async () => {
    user$ = new BehaviorSubject<Usuario | null>(null);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { user$, logout: () => Promise.resolve() } }
      ]
    }).compileComponents();
  });

  function enlacesDelMenu(): number {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    return fixture.debugElement.queryAll(By.directive(RouterLink)).length;
  }

  it('crea la aplicación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sin sesión solo muestra el enlace de iniciar sesión', () => {
    expect(enlacesDelMenu()).toBe(1);
  });

  it('un usuario estándar ve Pedidos y Ayuda', () => {
    user$.next({ uid: '1', email: 'usuario@jgcables.com', nombre: 'Usuario', rol: 'usuario' });
    expect(enlacesDelMenu()).toBe(2);
  });

  it('un administrador ve Pedidos, Dashboard, Usuarios y Ayuda', () => {
    user$.next({ uid: '2', email: 'admin@jgcables.com', nombre: 'Admin', rol: 'admin' });
    expect(enlacesDelMenu()).toBe(4);
  });
});
