import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  IonApp, IonSplitPane, IonMenu, IonContent, IonList,
  IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel,
  IonRouterOutlet, IonButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  receiptOutline, barChartOutline, peopleOutline,
  logInOutline, logOutOutline, hardwareChipOutline
} from 'ionicons/icons';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink, RouterLinkActive, AsyncPipe, NgIf,
    IonApp, IonSplitPane, IonMenu, IonContent, IonList,
    IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel,
    IonRouterOutlet, IonButton
  ]
})
export class AppComponent {
  public readonly auth = inject(AuthService);

  constructor() {
    addIcons({
      receiptOutline, barChartOutline, peopleOutline,
      logInOutline, logOutOutline, hardwareChipOutline
    });
  }

  logout() {
    this.auth.logout();
  }
}