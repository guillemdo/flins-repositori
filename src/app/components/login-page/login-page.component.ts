import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../serveis/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <section class="login-card">
        <p class="eyebrow">Autenticació simulada</p>
        <h1>Login</h1>
        <p class="subtitle">Formulari preparat per a la futura protecció de rutes.</p>

        <form class="login-form" [formGroup]="loginForm" (ngSubmit)="iniciarSessio()">
          <label>
            Email
            <input type="email" formControlName="email" placeholder="Usuari@test.com">
          </label>

          <label>
            Contrasenya
            <input type="password" formControlName="contrasenya" placeholder="1234">
          </label>

          <button type="submit" [disabled]="loginForm.invalid">Entrar</button>
        </form>

        <p class="missatge error" *ngIf="missatgeError">{{ missatgeError }}</p>
      </section>
    </div>
  `,
  styles: [`
    .login-page {
      position: relative;
      z-index: 0;
      min-height: calc(100vh - 160px);
      box-sizing: border-box;
      display: grid;
      place-items: center;
      padding: 2rem;
    }

    .login-page::before {
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

    .login-card {
      width: min(100%, 520px);
      background: rgba(255, 252, 254, 0.93);
      border-radius: 28px;
      padding: 2.25rem;
      box-shadow: 0 20px 45px rgba(39, 12, 44, 0.15);
      transform: translateY(-40px);
    }

    .eyebrow {
      margin: 0 0 0.75rem;
      color: #7a4a85;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      font-size: 0.82rem;
    }

    h1 {
      margin: 0;
      color: #af2fcf;
      font-size: 3rem;
    }

    .subtitle {
      margin: 0.75rem 0 1.5rem;
      color: #4b3f4e;
      line-height: 1.5;
    }

    .login-form {
      display: grid;
      gap: 1rem;
    }

    label {
      display: grid;
      gap: 0.45rem;
      color: #36243d;
      font-weight: 600;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(122, 74, 133, 0.35);
      border-radius: 14px;
      padding: 0.9rem 1rem;
      font-size: 1rem;
    }

    button {
      width: 100%;
      box-sizing: border-box;
      border: none;
      border-radius: 14px;
      background: #af2fcf;
      color: white;
      padding: 0.9rem 1rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .missatge {
      margin: 1rem 0 0;
      padding: 0.9rem 1rem;
      border-radius: 14px;
      font-weight: 600;
    }

    .missatge.error {
      background: #fff0d9;
      color: #6b4f00;
    }
  `]
})
export class LoginPageComponent {
  readonly loginForm;

  missatgeError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenya: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  iniciarSessio(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, contrasenya } = this.loginForm.getRawValue();
    const loginCorrecte = this.authService.login(email ?? '', contrasenya ?? '');

    if (loginCorrecte) {
      this.missatgeError = '';
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      this.router.navigate(returnUrl ? [returnUrl] : ['/preferits']);
      return;
    }

    this.missatgeError = 'Credencials incorrectes. Torna-ho a provar.';
  }
}
