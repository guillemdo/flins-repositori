import { Component } from '@angular/core';
import { CatalegPageComponent } from './components/cataleg-page/cataleg-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatalegPageComponent],
  template: `<app-cataleg-page />`,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {}