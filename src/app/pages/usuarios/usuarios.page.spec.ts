import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsuariosPage } from './usuarios.page';
import { SupabaseService } from '../../core/services/supabase.service';

describe('UsuariosPage', () => {
  let component: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosPage],
      providers: [
        { provide: SupabaseService, useValue: { getUsuarios: () => of([{ nombre: 'Prueba', email: 'prueba@jgcables.com' }]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
