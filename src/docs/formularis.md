# Formularis reactius

## FormulariCercaComponent

### Camp i validacions

- Camp: `termeCerca`
- Validators síncrons:
  - `Validators.minLength(2)`
  - `Validators.maxLength(50)`
- Validador asíncron:
  - `codiDisponibleValidator(elementService)`
  - Retorna `{ sensResultats: true }` si no hi ha coincidències

### Comportament

- Cerca automàtica amb `debounceTime(400)`.
- `trim()` i `distinctUntilChanged()` per evitar consultes redundants.
- Amb camp buit, carrega el llistat complet.
- Feedback de validació asíncrona quan el control està en `pending`.

## PreferitsPanelComponent

### Objectiu

Per a cada element preferit, mostrar i gestionar notes amb un formulari reactiu independent per a cada preferit, basat en `FormArray`.

### Estat del component

| Propietat         | Tipus                            | Descripció                                                             |
| ----------------- | -------------------------------- | ---------------------------------------------------------------------- |
| `formularisNotes` | `Record<string, FormGroup>`      | Un `FormGroup` per cada preferit, indexat per `elementId`              |
| `indexNotaNova`   | `Record<string, number \| null>` | Índex dins del `FormArray` del camp de nota en curs per cada preferit  |
| `preferitObert`   | `string \| null`                 | `elementId` del preferit amb el panell de notes visible (`null` = cap) |

### Estructura de cada FormGroup

```ts
FormGroup {
  notes: FormArray<FormControl<string>>
}
```

### Cicle de vida i inicialització

- `ngOnInit()`: itera `preferitsService.preferitsDetall()` i crida `inicialitzarFormulari()` per a cada preferit.
- `assegurarFormulari(preferit)`: inicialització lazy per a preferits afegits després de l'inici.
- Quan s'afegeix un nou preferit i s'obre el seu panell per primera vegada, el formulari es crea en aquell moment.

### Flux d'ús: crear una nota nova

1. L'usuari clica el botó `+` → `obrirEditorNotes(preferit, $event)`.
2. Obre el panell (`preferitObert = preferit.elementId`) si no estava obert.
3. Crida `afegirCampNota(elementId)`: afegeix un `FormControl` buit al `FormArray` i guarda l'índex a `indexNotaNova[elementId]`. Si ja hi havia un camp pendent, no fa res.
4. L'usuari escriu la nota al camp nou (únic camp editable).
5. El botó "Afegir nota" s'habilita quan `teNotaNovaValida(elementId)` retorna `true`.
6. L'usuari clica "Afegir nota" → `afegirNota(elementId)`:
   - Persista via `PreferitsService.afegirNota(elementId, nota)`.
   - Reseteja `indexNotaNova[elementId] = null`.
   - Reconstrueix el formulari des del servei (`inicialitzarFormulari`).

### Flux d'ús: eliminar una nota

- `eliminarNota(elementId, index)`:
  - Si `index === indexNotaNova[elementId]`: elimina el camp del `FormArray` sense cridar el servei (descarta la nota pendent).
  - Si és una nota guardada: crida `PreferitsService.eliminarNota(elementId, index)`, reconstrueix el formulari. Si hi havia un camp de nota nova pendent, es preserva el seu valor en el rebuild.
  - Si l'índex de la nota nova era posterior a l'eliminada, ajusta `indexNotaNova` (decrement en 1).

### Toggle del panell de notes

- Clicar sobre `X Notes` → `alternarPanelNotes(preferit, $event)`: obre o tanca el panell del preferit concret.
- `[class.seleccionat]` s'aplica a l'element quan `preferitObert === preferit.elementId`.

### Validacions de cada nota

- `Validators.required`
- `Validators.minLength(3)`

Es marca visualment amb la classe `.invalid` quan el control és `invalid` i ha estat `touched`.

### Notes existents (readonly)

Les notes ja guardades es mostren com a camps `readonly`. Només el camp de nota nova (`indexNotaNova[elementId]`) és editable.

### Persistència

Les notes es desen via `PreferitsService.afegirNota(elementId, nota)` o `PreferitsService.eliminarNota(elementId, index)`.

Ambdues operacions actualitzen el signal de preferits i criden `desarPreferits()`, que persisteix a localStorage amb la clau `preferits-cataleg`.
