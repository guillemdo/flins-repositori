import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetaPeliculaComponent } from '../targeta-pelicula/targeta-pelicula.component';
import { Dades } from '../../models/dades.models';

@Component({
  selector: 'app-llista-pelicules',
  standalone: true,
  imports: [CommonModule, TargetaPeliculaComponent],
  template: `
    <section id="llistat-pelicules" class="llistat" aria-label="Llistat de pel·lícules">
      <!-- *ngIf ESTAT BUIT: es mostra quan la llista no te cap element -->
      <div *ngIf="dades.length === 0" class="missatge-buit" role="status" aria-live="polite">
        <p>No hi ha pel·lícules disponibles</p>
      </div>

      <!-- *ngIf ESTAT AMB ELEMENTS: es mostra quan hi ha algun element a la llista -->
      <div *ngIf="dades.length > 0">
        <p class="total-resultats" aria-live="polite">
          Mostrant <strong>{{ dades.length | number }}</strong> pel·lícules
        </p>

        <div class="graella" role="list" aria-label="Resultats de la cerca">
          <!--
            *ngFor itera cada element de la llista i crea una <app-targeta-element>.
            trackBy trackById optimitza el rendiment. Angular identifica cada
            element pel seu 'id' i reutilitza els que no han canviat
            enlloc de destruir i recrear tota la llista.
          -->
          <app-targeta-pelicula
            *ngFor="let dada of dades; trackBy: trackById"
            role="listitem"
            [dada]="dada">
          </app-targeta-pelicula>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .llistat {
      width: 100%;
    }
    .graella {
      display: grid;
      grid-template-columns: 1fr; // 1 columna per defecte. Cas Mòbil.
      gap: 16px;
      padding: 24px 0;
    }
    .missatge-buit {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .missatge-buit p {
      font-size: 1.1rem;
      margin: 0;
    }
    .total-resultats {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    /* Responsive: 1 columna (mobil), 2 (tablet), 3 (desktop) */
    @media (min-width: 700px) {
      .graella {
        grid-template-columns: repeat(2, minmax(0, 1fr)); // 2 per tablet
        gap: 20px;
      }
    }
    @media (min-width: 1100px) {
      .graella {
        grid-template-columns: repeat(3, minmax(0, 1fr)); // 3 per desktop
        gap: 24px;
      }
    }
  `]
})
export class LlistaPeliculesComponent {
  // INPUT rep del pare (app arrel) la llista ja carregada/filtrada.
  @Input({ required: true }) dades: Dades[] = [];

  // trackBy per optimitzar el rendiment identificant cada element per id.
  trackById(index: number, dada: Dades): number {
    return dada.id;
  }
}
