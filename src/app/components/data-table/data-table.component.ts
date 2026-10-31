import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonLabel,
  IonSearchbar,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';

import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonLabel,
    IonSearchbar,
    IonSelect,
    IonSelectOption
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit, OnDestroy {

  // Columnas de la tabla
  @Input() columns: { key: string; label: string }[] = [];

  // Datos que recibe el componente
  @Input() data: any[] = [];

  // Evento que se emite al seleccionar una fila
  @Output() rowSelect = new EventEmitter<any>();

  // Evento que se emite al buscar
  @Output() searchChanged = new EventEmitter<string>();

  // Texto de búsqueda
  searchTerm: string = '';

  // Página actual
  currentPage: number = 1;

  // Número de filas por página
  pageSize: number = 5;

  // Subject para controlar las búsquedas
  private searchSubject = new Subject<string>();

  // Subject para finalizar las suscripciones
  private destroy$ = new Subject<void>();

  // Permite repintar la tabla cuando cambia la búsqueda (componente OnPush y app sin Zone.js)
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {

    // Escuchar los cambios de búsqueda
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((term: string) => {

        this.searchTerm = term;
        this.currentPage = 1;

        // Repintar la tabla con el nuevo filtro
        this.cdr.markForCheck();

        // Avisar a la página padre
        this.searchChanged.emit(term);

      });

  }

  // Recibir el texto introducido en el buscador
  onSearchInput(term: string): void {
    this.searchSubject.next(term);
  }

  // Filtrar los datos según el texto de búsqueda
  get filteredData(): any[] {

    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.data ?? [];
    }

    return (this.data ?? []).filter((row: any) => {

      return this.columns.some((column) => {

        const value = row[column.key];

        return String(value ?? '')
          .toLowerCase()
          .includes(term);

      });

    });

  }

  // Calcular el número total de páginas
  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(this.filteredData.length / this.pageSize)
    );

  }

  // Obtener los datos de la página actual
  get paginatedData(): any[] {

    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredData.slice(
      startIndex,
      startIndex + this.pageSize
    );

  }

  // Cambiar a la página anterior
  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }

  }

  // Cambiar a la página siguiente
  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }

  }

  // Cambiar el número de filas por página
  onPageSizeChange(size: number | string): void {

    const parsedSize = Number(size);

    if (
      Number.isInteger(parsedSize) &&
      parsedSize > 0
    ) {

      this.pageSize = parsedSize;
      this.currentPage = 1;

    }

  }

  // Seleccionar una fila
  selectRow(row: any): void {
    this.rowSelect.emit(row);
  }

  // Liberar las suscripciones al destruir el componente
  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

    this.searchSubject.complete();

  }

}