import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PedidosPage } from './pedidos.page';
import { FirebaseService } from '../../core/services/firebase.service';

describe('PedidosPage', () => {
  let component: PedidosPage;
  let fixture: ComponentFixture<PedidosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosPage],
      providers: [
        provideRouter([]),
        { provide: FirebaseService, useValue: { getPedidos: () => of([]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
