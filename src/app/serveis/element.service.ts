import { Injectable, Signal, computed, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ElementCataleg, ElementApiResponse, EstatServei } from '../models/element.model';
import { adaptarElementsApi } from '../adaptadors/element.adaptador';
import { environment } from '../../environments/environment';

// El Servei te totes les dades centralitzades, ofereix mètodes de cerca,
// i gestiona l'estat de carregant i errors. Els components només consumeixen les dades i mostren la UI.
// Tot en un sol lloc per a facilitar manteniment i evolució futura.

// El servei es declara injectable a nivell de root, així està disponible a tota l'aplicació
// sense necessitat de declarar-lo en cap mòdul específic.
@Injectable({
  providedIn: 'root'
})
export class ElementService {
  private readonly elementsSignal = signal<ElementCataleg[]>([]);
  private readonly carregantSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null); // la variable pot ser String o null. Es una unió de tipus.
  private readonly inicialitzatSignal = signal(false);

  readonly elements: Signal<ElementCataleg[]> = this.elementsSignal.asReadonly();
  readonly carregant: Signal<boolean> = this.carregantSignal.asReadonly();
  readonly error: Signal<string | null> = this.errorSignal.asReadonly();
  readonly estat: Signal<EstatServei> = computed(() => {
    if (this.carregantSignal()) {
      return 'carregant';
    }

    if (this.errorSignal()) {
      return 'error';
    }

    if (this.inicialitzatSignal()) {
      return 'exit';
    }

    return 'inicial';
  });

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenirTots(): void {
    this.executarPeticio(`${this.apiUrl}/elements`);
  }

  obtenirPopulars(): void {
    this.executarPeticio(`${this.apiUrl}/elements?popular=true`);
  }

  cercar(terme: string): void {
    if (!terme.trim()) {
      this.obtenirTots();
      return;
    }

    this.executarPeticio(`${this.apiUrl}/elements?q=${terme}`);
  }

  teResultatsPerTerme(terme: string): Observable<boolean> {
    const termeNormalitzat = terme.trim();

    if (!termeNormalitzat) {
      return of(true);
    }

    return this.http.get<ElementApiResponse[]>(`${this.apiUrl}/elements?q=${termeNormalitzat}`)
      .pipe(
        map((elements) => elements.length > 0),
        catchError(() => of(false))
      );
  }

  obtenirPerId(id: string): Observable<ElementCataleg | null> {
    return this.http.get<ElementApiResponse[]>(`${this.apiUrl}/elements?id=${id}`)
      .pipe(
        map((elements) => adaptarElementsApi(elements)[0] ?? null),
        catchError(() => of(null))
      );
  }

  reiniciar(): void {
    this.elementsSignal.set([]);
    this.carregantSignal.set(false);
    this.errorSignal.set(null);
    this.inicialitzatSignal.set(false);
  }

  private executarPeticio(url: string): void {
    this.carregantSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<ElementApiResponse[]>(url)
      .pipe(
        map(adaptarElementsApi),
        tap(elements => {
          this.elementsSignal.set(elements);
          this.carregantSignal.set(false);
          this.inicialitzatSignal.set(true);
        }),
        catchError((error: HttpErrorResponse) => {
          this.carregantSignal.set(false);
          this.elementsSignal.set([]);
          this.errorSignal.set(this.gestionarError(error));
          this.inicialitzatSignal.set(true);
          return of([]);
        })
      )
      .subscribe();
  }

  codiDisponible(codi: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.http.get<ElementApiResponse[]>(`${this.apiUrl}/elements?id=${codi}`)
          .subscribe({
            next: (elements) => resolve(elements.length === 0),
            error: () => resolve(false)
          });
      }, 500);  // Simula latència de validació
    });
  }

  private gestionarError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Error de xarxa: ${error.error.message}`;
    }

    switch (error.status) {
      case 0:
        return 'No es pot connectar al servidor. Comprova que json-server està actiu.';
      case 404:
        return 'Endpoint no trobat. Verifica la URL de l\'API.';
      case 500:
        return 'Error intern del servidor.';
      default:
        return `Error desconegut (${error.status}): ${error.message}`;
    }
  }
}