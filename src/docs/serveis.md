# Serveis

## ElementService (servei HTTP)

### Objectiu

Gestionar la càrrega d'elements del catàleg des de l'API mock i exposar l'estat de la petició per a la UI.

### URL base

- `environment.apiUrl` (`src/environments/environment.ts`)

### Endpoints utilitzats

- `GET /elements`
  : llistat complet.
- `GET /elements?popular=true`
  : llistat d'elements populars.
- `GET /elements?q={terme}`
  : cerca per text.
- `GET /elements?id={id}`
  : comprovació de codi existent (validació asíncrona).

### Signals de lectura

- `elements: Signal<ElementCataleg[]>`
- `carregant: Signal<boolean>`
- `error: Signal<string | null>`
- `estat: Signal<'inicial' | 'carregant' | 'exit' | 'error'>`

### Mètodes públics principals

- `obtenirTots(): void`
- `obtenirPopulars(): void`
- `cercar(terme: string): void`
- `teResultatsPerTerme(terme: string): Observable<boolean>`
- `codiDisponible(codi: string): Promise<boolean>`
- `reiniciar(): void`

### Flux d'estats

Totes les càrregues principals (`obtenirTots`, `obtenirPopulars`, `cercar`) passen per `executarPeticio(url)`:

1. `carregant = true`
2. `error = null`
3. HTTP GET + adaptació de dades (`adaptarElementsApi`)
4. En èxit:
   : actualitza `elements`, `carregant = false`, `estat = 'exit'`
5. En error:
   : buida `elements`, assigna missatge a `error`, `carregant = false`, `estat = 'error'`

## PreferitsService

### Objectiu

Gestionar preferits i notes associades, amb persistència a localStorage.

### Persistència

- Clau localStorage: `preferits-cataleg`
- Càrrega automàtica al constructor (`carregarPreferits()`)
- Guardat en cada mutació (`desarPreferits()`)

### Signals de lectura

- `preferitsDetall: Signal<Preferit[]>`
- `preferits: Signal<ElementCataleg[]>`
- `totalPreferits: Signal<number>`

### Mètodes públics

- `afegirPreferit(element: ElementCataleg): void`
- `eliminarPreferit(id: string): void`
- `esPreferit(id: string): boolean`
- `afegirNota(elementId: string, nota: string): void`
- `eliminarNota(elementId: string, indexNota: number): void`
- `actualitzarNotes(elementId: string, notes: string[]): void`
- `obtenirPreferit(elementId: string): Preferit | undefined`

### Gestió d'errors

- Lectura i escriptura de localStorage protegides amb `try/catch`.
- En error de càrrega, el servei inicialitza preferits buits per mantenir l'aplicació operativa.
