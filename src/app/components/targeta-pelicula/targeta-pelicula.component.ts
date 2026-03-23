import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dades } from '../../models/dades.models';

@Component({
  selector: 'app-targeta-pelicula',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- defineixo comportament com a button per un futur, de moment no fa res -->
    <article
      class="targeta"
      tabindex="0"
      role="button" 
      [attr.aria-label]="'Detall de ' + dada.titol">
      <img
        [src]="dada.imatge || '/unnamed.jpg'"
        (error)="onImageError($event)"
        [alt]="'Cartell de ' + dada.titol"
        class="targeta-imatge">
      <div class="targeta-contingut">
        <!-- PIPE titlecase: cada paraula amb la primera lletra majúscula-->
        <h3>{{ dada.titol | titlecase }}</h3>
        <!-- PIPE lowercase + estil italic per al director -->
        <p class="director">{{ dada.director | lowercase }}</p>
        <div class="targeta-info">
          <span *ngIf="dada.protagonistes" class="categoria">
            {{ dada.protagonistes }}
          </span>
          <span *ngIf="dada.valoracio" class="valoracio" [attr.aria-label]="'Valoracio ' + (dada.valoracio | number:'1.1-1') + ' sobre 5'">
            <i class="bi bi-star-fill" aria-hidden="true"></i> {{ dada.valoracio | number:'1.1-1' }} /5
          </span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .targeta {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.3s, transform 0.2s;
      background: #fff;
      cursor: pointer;
    }
    
    .targeta:hover,
    .targeta:focus-visible {
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
      transform: translateY(-2px);
      outline: 2px solid #30172c;
      outline-offset: 2px;
    }
    
    .targeta-imatge {
      width: 100%;
      height: 320px;
      object-fit: cover;
    }
    .targeta-contingut {
      padding: 16px;
    }
    .targeta-contingut h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      line-height: 1.3;
      min-height: 2.6em;
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
    }
    .targeta-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      gap: 8px;
      flex-wrap: wrap;
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
        height: 240px;
      }
    }
  `]
})
export class TargetaPeliculaComponent {
  // INPUT: dades que arriben del pare.
  @Input({ required: true }) dada!: Dades;

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/unnamed.jpg';
    img.onerror = null;
  }
}
