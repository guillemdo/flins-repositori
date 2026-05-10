import { Component } from '@angular/core';

import { PreferitsPanelComponent } from '../preferits-panel/preferits-panel.component';

@Component({
  selector: 'app-preferits-page',
  standalone: true,
  imports: [PreferitsPanelComponent],
  template: `
    <div class="preferits-page">
      <header class="page-header">
        <h1>Preferits</h1>
        <p class="subtitle">Consultar els elements desats</p>
      </header>

      <app-preferits-panel></app-preferits-panel>
    </div>
  `,
  styles: [`
    .preferits-page {
      position: relative;
      z-index: 0;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 100vh;
      padding: 2rem;
    }

    .preferits-page::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url('/BackgroundPride.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: -1;
      pointer-events: none;
    }

    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    h1 {
      margin: 0 0 0.5rem;
      color: #af2fcf;
      font-size: 4rem;
    }

    .subtitle {
      margin: 0;
      color: #292828;
      font-size: 1.1rem;
    }

    app-preferits-panel {
      display: block;
      width: 66.6667%;
      margin: 0 auto;
    }

    @media (max-width: 900px) {
      app-preferits-panel {
        width: 100%;
      }
    }
  `]
})
export class PreferitsPageComponent {}