import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { ElementCataleg } from '../../models/element.model';

@Component({
  selector: 'app-element-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="targeta" tabindex="0" role="button" [attr.aria-label]="'Detall de ' + dada.nom">
      <img
        [src]="dada.imatge || '/unnamed.jpg'"
        (error)="onImageError($event)"
        [alt]="'Cartell de ' + dada.nom"
        class="targeta-imatge"
      />
      <div class="targeta-contingut">
        <h3>{{ dada.nom | titlecase }}</h3>
        <p class="director">{{ dada.descripcio | lowercase }}</p>
        <div class="targeta-info">
          <span class="categoria">{{ dada.categoria }}</span>
          <span *ngIf="dada.valoracio" class="valoracio" [attr.aria-label]="'Valoracio ' + (dada.valoracio | number:'1.1-1') + ' sobre 5'">
            {{ dada.valoracio | number:'1.1-1' }} /5
          </span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .targeta {
      height: 430px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.3s, transform 0.2s;
      background: #fff;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .targeta:hover,
    .targeta:focus-visible {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
      outline: 2px solid #30172c;
      outline-offset: 2px;
    }

    .targeta-imatge {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .targeta-contingut {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .targeta-contingut h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      line-height: 1.3;
      min-height: 2.6em;
      line-clamp: 2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .targeta-contingut p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .targeta-contingut p.director {
      font-style: italic;
      line-clamp: 2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .targeta-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 0.85rem;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: auto;
    }

    .categoria {
      background: #e3f2fd;
      padding: 4px 8px;
      border-radius: 4px;
      color: #1976d2;
    }

    .valoracio {
      color: #b64e00;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .targeta-imatge {
        height: 200px;
      }
    }
  `]
})
export class ElementCardComponent {
  @Input({ required: true }) dada!: ElementCataleg;

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/unnamed.jpg';
    img.onerror = null;
  }
}