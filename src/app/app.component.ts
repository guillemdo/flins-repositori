import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlistaPeliculesComponent } from './components/llista-pelicules/llista-pelicules.component';
import { BarraCercaComponent } from './components/barra-cerca/barra-cerca.component';
import { ELEMENTS_MOCK } from './mocks/dades-mock';
import { Dades } from './models/dades.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LlistaPeliculesComponent, BarraCercaComponent],
  // primer importem els components que TypeScript necesitarà (fora del Component).      import
  // Després Angular (dins ja del Component) habilita el seu ús dins la plantilla HTML.  imports
  template: `
    <main class="contenidor" [attr.aria-busy]="carregant"> 
      <!-- Al executar la class 'AppComponent', aria-busy està en True com la variable carregant,
       i canvia a False quan la càrrega acaba. -->
      <header>
        <h1 id="catalog-title">Catàleg de Flins</h1>
        <p>Unitat 2 - Components i interficie</p>
      </header>

      <app-barra-cerca (cercaCanviada)="filtrarDades($event)"></app-barra-cerca>

      <!-- estat UI: carrega inicial i cerca en curs -->
      <div *ngIf="carregant" class="estat-carregant" role="status" aria-live="polite" aria-atomic="true">
        <!--
          role="status", aria-live="polite" i aria-atomic="true" són atributs d'accessibilitat, lectors de pantalla.
          Formen part de la compatibilitat amb tecnologies assistives. No implementem un lector de pantalla,
          però es correcte (bona pràctica) que el nostre codi en sigui compatible.
          aria-hidden="true" indica decoratiu, per que quedi fora dels lectors de pantalla.
        -->
        <div class="spinner" aria-hidden="true"></div>
        <p>Carregant pel·lícules...</p>
      </div>

      <!-- estat UI: contingut llest -->
      <section *ngIf="!carregant" aria-labelledby="catalog-title">
        <div *ngIf="textCercaActual" class="info-resultats" aria-live="polite"> <!-- ngIf, si hi ha textCercaActual es veu la resta del bloc.-->
          <p>
            <strong>{{ dadesFiltrades.length }}</strong>
            {{ dadesFiltrades.length === 1 ? 'resultat' : 'resultats' }}
            <!-- Operador ternari. Si el resultat es 1 mostra "resultat", si es 0 o mes que 1 mostra "resultats". --> 
            per <em>"{{ textCercaActual }}"</em>
          </p>
        </div>

        <!-- estat UI llistat disponible   repasar -->
        <app-llista-pelicules
          *ngIf="dadesFiltrades.length > 0"
          [dades]="dadesFiltrades">
        </app-llista-pelicules>
      </section>
    </main>
  `,
  styles: [`
    .contenidor {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      text-align: center;
      margin-bottom: 40px;
    }
    header h1 {
      margin: 0 0 8px 0;
      color: #be3ead;
      font-size: 4rem;  // estil h1 per desktop
    }
    header p {
      margin: 0;
      color: #666;
    }
    .info-resultats {
      background: #dbc6ba;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .info-resultats p {
      margin: 0;
      color: #5a5b68;
    }
    .info-resultats em {
      font-style: normal;
      font-weight: 600;
    }
    .estat-carregant {
      text-align: center;
      padding: 60px 20px;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e0e0e0;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite; // animació de rotació contínua necesària per que el @keyframes funcioni.
      margin: 0 auto 20px;
    }
    @keyframes spin {     // per fer animacions CSS.
      to { transform: rotate(360deg); }
    }
    .estat-carregant p {
      color: #666;
      font-size: 1.1rem;
    }
    .estat-buit {
      text-align: center;
      padding: 60px 20px;
      background: #fff3e0;
      border-radius: 8px;
      margin-top: 24px;
    }
    .estat-buit p {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      color: #333;
    }
    .suggeriment {
      color: #e91111;
      font-size: 0.95rem;
    }
   
    @media (max-width: 768px) {  
      .contenidor {
        padding: 12px;
      }
      header {
        margin-bottom: 24px;
      }
      header h1 {         // estil h1 per mòbil.
        font-size: 1.6rem; /* mòbil */
      }
    }
  `]
})
export class AppComponent {
  // Dades inici i estat general de la pantalla.
  dadesCompletes: Dades[] = [];
  dadesFiltrades: Dades[] = [];
  textCercaActual = '';
  carregant = true;
  ngOnInit(): void {
    // ngOnInit() és un mètode del cicle de vida d'Angular que s'executa just després que el component s'hagi inicialitzat,
    // i configurat els seus inputs. És ideal per fer càrregues de dades inicials.
    setTimeout(() => {
      // setTimeout executa un bloc de codi després d'esperar x segons.
      // Aquí simulem la càrrega inicial de dades. Per veure el Spinner i provar-lo.
      this.dadesCompletes = ELEMENTS_MOCK;
      this.dadesFiltrades = this.dadesCompletes;
      this.carregant = false;
    }, 2000);
  }

  filtrarDades(textCerca: string): void {
    this.textCercaActual = textCerca;
    this.carregant = true;

    // Simular temps de cerca
    setTimeout(() => {
      if (!textCerca) {
        this.dadesFiltrades = this.dadesCompletes;
      } else {
        const cercaMinuscules = textCerca.toLowerCase();
        this.dadesFiltrades = this.dadesCompletes.filter(dada =>
          dada.titol.toLowerCase().includes(cercaMinuscules) ||
          dada.director.toLowerCase().includes(cercaMinuscules) ||
          dada.protagonistes?.toLowerCase().includes(cercaMinuscules)
        );
      }
      this.carregant = false;
    }, 500);
  }
}
