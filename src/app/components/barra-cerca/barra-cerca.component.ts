import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barra-cerca',
  standalone: true,
  // FormsModule es obligatori per [(ngModel)] i les validacions d'ngForm.
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Plantilla formulari -->
    <form class="formulari-cerca" (ngSubmit)="cercar()" #formCerca="ngForm" role="search" aria-label="Formulari de cerca de pel·lícules">
      <div class="grup-camp">
        <label for="camp-cerca">Cerca pel·lícules:</label>
        <div class="contenidor-input">
          <input
            type="text"
            id="camp-cerca"
            name="cerca"
            [(ngModel)]="textCerca"
            #campCerca="ngModel"
            minlength="3"
            aria-required="true"
            [attr.aria-invalid]="campCerca.invalid && campCerca.touched ? 'true' : 'false'"
            aria-describedby="ajuda-cerca error-cerca"
            aria-controls="llistat-pelicules"
            autocomplete="off"
            placeholder="Minim 3 caracters..."
            class="input-cerca"
            [class.invalid]="campCerca.invalid && campCerca.touched">

          <button
            type="submit"
            [disabled]="formCerca.invalid"
            class="boto-cerca"
            aria-label="Cercar pel·lícules">
            <i class="bi bi-search" aria-hidden="true"></i> Cercar
          </button>

          <button
            *ngIf="textCerca"
            type="button"
            (click)="netejar()"
            class="boto-netejar"
            aria-label="Esborrar cerca">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
       
        <div
          *ngIf="campCerca.invalid && campCerca.touched"
          id="error-cerca"
          class="error"
          role="alert"
          aria-live="assertive">
          <span *ngIf="campCerca.errors?.['minlength']">
            Cal un minim de {{ campCerca.errors?.['minlength'].requiredLength }} caracters
          </span>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .formulari-cerca {
      margin-bottom: 32px;
    }
    .grup-camp {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    label {
      font-weight: 600;
      color: #333;
    }
    .contenidor-input {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }
    .input-cerca {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s, background-color 0.3s;
      background: #fff;
    }
    .input-cerca:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.15);
    }
    /* classe dinamica de validació Angular. .ng-invalid i .ng-touched
    Aquests estils complementen els anteriors en cas que es facin servir en altres contextos.
    */
    .input-cerca.invalid,
    .input-cerca.ng-invalid.ng-touched {
      border-color: #d32f2f;
      background-color: #ffebee;
    }
    .boto-cerca {
      padding: 12px 24px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s, opacity 0.3s;
      font-weight: 500;
    }
    .boto-cerca:hover:not(:disabled) {
      background: #1565c0;
      transform: translateY(-2px);
    }
    .boto-cerca:disabled {
      background: #bdbdbd;
      cursor: not-allowed;
      opacity: 0.6;
    }
    .boto-netejar {
      padding: 12px;
      background: #f5f5f5;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .boto-netejar:hover {
      background: #e0e0e0;
    }
    .ajuda {
      color: #666;
      font-size: 0.875rem;
    }
    .error {
      color: #d32f2f;
      font-size: 0.875rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .contenidor-input {
        flex-direction: column;
      }
      .boto-cerca,
      .boto-netejar {
        width: 100%;
      }
    }
  `]
})
export class BarraCercaComponent {
  // gestiona la cerca comunicant canvis al pare (app arrel).
  @Output() cercaCanviada = new EventEmitter<string>();

  textCerca = '';

  cercar(): void {
    if (this.textCerca.length >= 3) {
      this.cercaCanviada.emit(this.textCerca);
    }
  }

  netejar(): void {
    this.textCerca = '';
    this.cercaCanviada.emit('');
  }
}
