import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { IonCard, IonCardContent, IonIcon, IonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { statsChart } from 'ionicons/icons';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [IonCard, IonCardContent, IonIcon, IonText],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent {
  constructor() {
    addIcons({ statsChart });
  }

  // Título de la tarjeta
  @Input() title: string = '';

  // Valor que se muestra
  @Input() value: number | string = 0;

  // Icono de Ionic
  @Input() icon: string = 'stats-chart';

  // Color de la tarjeta
  @Input() color: string = 'primary';

  // Evento que se emite al pulsar la tarjeta
  @Output() cardClick = new EventEmitter<void>();

  // Método para gestionar el clic
  onCardClick(): void {
    this.cardClick.emit();
  }
}
