import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormulariCercaComponent } from '../formulari-cerca/formulari-cerca.component';
import { ElementCataleg } from '../../models/element.model';
import { ElementService } from '../../serveis/element.service';
import { PreferitsService } from '../../serveis/preferits.service';

@Component({
  selector: 'app-cerca-page',
  standalone: true,
  imports: [CommonModule, FormulariCercaComponent],
  template: `
    <div class="cerca-page">
      <header class="page-header">
        <h1>Cerca de Flins</h1>
        <p class="subtitle">Cerca de resultats sense recarregar la pàgina</p>
      </header>

      <app-formulari-cerca />

      <div class="estat-carregant" *ngIf="elementService.estat() === 'carregant'">
        <div class="spinner"></div>
        <p>Carregant elements...</p>
      </div>

      <div class="estat-error" *ngIf="elementService.estat() === 'error'">
        <div class="error-icon">⚠️</div>
        <h2>Error al carregar elements</h2>
        <p class="error-missatge">{{ elementService.error() }}</p>
        <button class="btn-reintentar" (click)="reintentar()">Reintentar</button>
      </div>

      <div class="estat-exit" *ngIf="elementService.estat() === 'exit'">
        <div class="sense-resultats" *ngIf="elementService.elements().length === 0">
          <p>No s'han trobat resultats per a la cerca actual</p>
        </div>

        <div class="elements-grid" *ngIf="elementService.elements().length > 0">
          <div class="element-card" *ngFor="let element of elementService.elements()" (click)="anarADetall(element.id)" role="button" tabindex="0" (keydown.enter)="anarADetall(element.id)" [attr.aria-label]="'Veure detall de ' + element.nom">
            <img [src]="element.imatge" [alt]="element.nom" class="element-imatge">
            <button class="btn-preferit" [class.actiu]="preferitsService.esPreferit(element.id)" (click)="togglePreferit($event, element)">
              {{ preferitsService.esPreferit(element.id) ? '★' : '☆' }}
            </button>

            <div class="element-info">
              <h3 class="element-nom">{{ element.nom }}</h3>
              <p class="element-categoria">{{ element.categoria }}</p>
              <div class="descripcio-fila">
                <p class="element-descripcio">{{ element.descripcio }}</p>
                <p class="element-valoracio" *ngIf="element.valoracio !== undefined && element.valoracio !== null">
                  <span class="valoracio-icona">★</span>
                  {{ element.valoracio | number:'1.1-1' }}
                  <span class="valoracio-max">/ 5</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cerca-page {
      position: relative;
      z-index: 0;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
    }

    .cerca-page::before {
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

    .estat-carregant,
    .sense-resultats {
      text-align: center;
      padding: 3rem 0;
    }

    .spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .estat-error {
      background-color: #fee;
      border: 2px solid #e74c3c;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      margin: 2rem 0;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .error-missatge {
      margin-bottom: 1rem;
    }

    .btn-reintentar {
      background-color: #36243d;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      font-size: 1rem;
      cursor: pointer;
    }

    .elements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .element-card {
      position: relative;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
    }

    .element-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .element-imatge {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .element-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
    }

    .element-nom {
      margin: 0;
      color: #333;
    }

    .element-categoria {
      margin: 0;
      color: #3498db;
      font-weight: 600;
    }

    .element-descripcio {
      margin: 0;
      color: #666;
      flex: 1;
    }

    .descripcio-fila {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .element-valoracio {
      margin: 0;
      font-size: 0.95rem;
      color: #6b4f00;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      white-space: nowrap;
    }

    .valoracio-icona {
      color: #f39c12;
    }

    .valoracio-max {
      color: #8a6d1f;
      font-weight: 500;
    }

    .btn-preferit {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: white;
      border: 2px solid #f39c12;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .btn-preferit.actiu {
      background-color: #f39c12;
      color: white;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class CercaPageComponent implements OnInit {
  constructor(
    public elementService: ElementService,
    public preferitsService: PreferitsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.elementService.reiniciar();
  }

  reintentar(): void {
    this.elementService.reiniciar();
  }

  togglePreferit(event: Event, element: ElementCataleg): void {
    event.stopPropagation();
    if (this.preferitsService.esPreferit(element.id)) {
      this.preferitsService.eliminarPreferit(element.id);
      return;
    }

    this.preferitsService.afegirPreferit(element);
  }

  anarADetall(id: string): void {
    this.router.navigate(['/detall', id]);
  }
}