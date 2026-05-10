# Optimitzacio de rendiment

## Components amb OnPush i motiu

- ElementCardComponent
  Motiu: component molt present de targeta que rep dades per @Input i gairebe només renderitza UI. Redueix renders innecessaris.

- DetallPageComponent
  Motiu: vista de detall principalment de presentació. Amb OnPush es limita el cost de render i la vista només es recarrega
  quan canvien dades.

## Configuracio de la virtualitzacio

- Component: CatalegPageComponent
- Estrategia: virtualitzacio per files (cada item virtual es una fila de targetes) per que es carreguin de tres en tres.
    sinó s'hem carregaven d'una en una en vertical.
- En virtualització, itemSize és l’alçada en píxels que Angular CDK assumeix per cada element virtual de la llista.
    En aquest cas el valor que em va bé per que l'scroll funcioni suau i carregui de forma eficient és 412 px.
- Nombre d'elements de la llista: 17. Son pocs però suficients per veure el comportament.
