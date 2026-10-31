import { Component } from '@angular/core';
import {
  IonAccordion, IonAccordionGroup, IonButtons, IonContent, IonHeader, IonItem,
  IonLabel, IonMenuButton, IonTitle, IonToolbar
} from '@ionic/angular';

/** Manual de usuario integrado en la aplicación. */
@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
  imports: [
    IonAccordion, IonAccordionGroup, IonButtons, IonContent, IonHeader, IonItem,
    IonLabel, IonMenuButton, IonTitle, IonToolbar
  ]
})
export class AyudaPage {}
