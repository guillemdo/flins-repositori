import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuari {
  id: number;
  nom: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuariActualSubject = new BehaviorSubject<Usuari | null>(null);

  estaAutenticat(): boolean {
    return this.usuariActualSubject.value !== null;
  }

  obtenirUsuari(): Observable<Usuari | null> {
    return this.usuariActualSubject.asObservable();
  }

  login(email: string, contrasenya: string): boolean {
    if (email === 'Usuari@test.com' && contrasenya === '1234') {
      this.usuariActualSubject.next({
        id: 1,
        nom: 'Usuari',
        email
      });
      return true;
    }

    return false;
  }

  logout(): void {
    this.usuariActualSubject.next(null);
  }
}