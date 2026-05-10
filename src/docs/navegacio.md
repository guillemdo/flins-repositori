# Navegacio SPA

## Mapa de rutes

| Path          | Component                | Acces  |
| ------------- | ------------------------ | ------ |
| `/`           | Redireccio a `cataleg`   | Public |
| `/cataleg`    | `CatalegPageComponent`   | Public |
| `/cerca`      | `CercaPageComponent`     | Public |
| `/detall/:id` | `DetallPageComponent`    | Public |
| `/preferits`  | `PreferitsPageComponent` | Public |
| `/login`      | `LoginPageComponent`     | Public |
| `**`          | Redireccio a `cataleg`   | Public |

## Configuracio

`provideRouter(routes)` s'ha configurat a `src/app/app.config.ts` per registrar el sistema de rutes de l'aplicacio.

`RouterOutlet` s'ha afegit al template d'`AppComponent` per renderitzar la vista activa sense recarregar la pagina.

`RouterLink` i `RouterLinkActive` s'utilitzen al component de navegacio per moure's entre les vistes principals i marcar visualment la ruta activa.
