import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { UserDashboardPage } from './user-dashboard.page';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';

describe('UserDashboardPage', () => {
  let component: UserDashboardPage;
  let fixture: ComponentFixture<UserDashboardPage>;

  beforeEach(async () => {
    const usuario = { uid: '1', email: 'usuario@jgcables.com', nombre: 'Usuario', rol: 'usuario' as const };
    await TestBed.configureTestingModule({
      imports: [UserDashboardPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { user$: new BehaviorSubject(usuario) } },
        { provide: FirebaseService, useValue: { getPedidos: () => of([]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
