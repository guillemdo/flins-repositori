import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../serveis/auth.service';

@Component({
  selector: 'app-navegacio',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-shell" aria-label="Navegacio principal">
      <div class="nav-links">
        <a routerLink="/cataleg" routerLinkActive="actiu" [routerLinkActiveOptions]="{ exact: true }">Catàleg</a>
        <a routerLink="/cerca" routerLinkActive="actiu">Cerca</a>
        <a routerLink="/preferits" routerLinkActive="actiu">Preferits</a>
      </div>

      <div class="auth-actions">
        <ng-container *ngIf="usuari$ | async as usuari; else sessioTancada">
          <span class="usuari-nom">{{ usuari.nom }}</span>
          <button type="button" class="btn-logout" (click)="tancarSessio()">Tancar sessió</button>
        </ng-container>

        <ng-template #sessioTancada>
          <a routerLink="/login" routerLinkActive="actiu">Iniciar sessió</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .nav-shell {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1rem 2rem;
      backdrop-filter: blur(14px);
      background:transparent;
      border-bottom: 1px solid rgba(175, 47, 207, 0.2);
      box-shadow: 0 8px 24px rgba(56, 20, 66, 0.08);
    }

    .nav-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .auth-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .usuari-nom {
      color: #af2fcf;
      font-weight: 700;
      padding: 0.35rem 0.5rem;
      background: transparent;
    }

    .nav-links a,
    .auth-actions a,
    .btn-logout {
      text-decoration: none;
      color: #36243f;
      padding: 0.65rem 1rem;
      border-radius: 999px;
      font-weight: 600;
      transition: background-color 0.3s ease, color 0.3s ease;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      font-family: inherit;
    }

    .nav-links a:hover,
    .nav-links a.actiu,
    .auth-actions a:hover,
    .auth-actions a.actiu,
    .btn-logout:hover {
      background: #36243db2;
      color: #fff;
    }

    @media (max-width: 768px) {
      .nav-shell {
        padding: 1rem;
        flex-direction: column;
      }

      .nav-links {
        justify-content: center;
      }

      .auth-actions {
        justify-content: center;
      }

      .usuari-nom {
        text-align: center;
      }
    }
  `]
})
export class NavegacioComponent {
  readonly usuari$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuari$ = this.authService.obtenirUsuari();
  }

  tancarSessio(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}