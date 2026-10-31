import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter,
  Input, OnChanges, OnDestroy, Output, ViewChild
} from '@angular/core';
import Chart from 'chart.js/auto';

/** Gráfico reutilizable (Chart.js). Recibe datos por @Input y emite el segmento pulsado. */
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() type: 'bar' | 'doughnut' = 'bar';
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Output() segmentClick = new EventEmitter<string>();

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [{
          label: this.title,
          data: this.values,
          backgroundColor: ['#0e5a63', '#b8501a', '#d99a1e', '#5b4b8a', '#1f7a4d', '#5c6b73']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (_evento, elementos) => {
          if (elementos.length > 0) {
            this.segmentClick.emit(this.labels[elementos[0].index]);
          }
        }
      }
    });
  }

  // Se ejecuta cada vez que el padre envía datos nuevos
  ngOnChanges(): void {
    if (!this.chart) {
      return;
    }
    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0].data = this.values;
    this.chart.update();
  }

  // Libera el gráfico al salir de la página (evita fugas de memoria)
  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}