# Models

## Interfícies TypeScript

## Catàleg

### ElementApiResponse (resposta API)

```ts
export interface ElementApiResponse {
  id: string;
  nom: string;
  descripcio: string;
  categoria: string;
  valoracio?: number;
  preu?: number;
  imatge: string;
  popular?: boolean;
  stock?: number;
}
```

### ElementCataleg (model intern)

```ts
export interface ElementCataleg {
  id: string;
  nom: string;
  descripcio: string;
  categoria: string;
  valoracio?: number;
  imatge: string;
  esPopular?: boolean;
}
```

### ElementsCercaResponse

```ts
export interface ElementsCercaResponse {
  elements: ElementApiResponse[];
  total: number;
}
```

### EstatServei

```ts
export type EstatServei = "inicial" | "carregant" | "exit" | "error";
```

## Preferits

### Preferit (model intern de preferits)

```ts
export interface Preferit {
  elementId: string;
  elementNom: string;
  element: ElementCataleg;
  notes: string[];
  dataAfegit: Date;
}
```

## Mapeig API -> model intern

| Camp API (`ElementApiResponse`) | Camp intern (`ElementCataleg`) | Tipus      | Notes               |
| ------------------------------- | ------------------------------ | ---------- | ------------------- |
| `id`                            | `id`                           | `string`   | Sense transformació |
| `nom`                           | `nom`                          | `string`   | Sense transformació |
| `descripcio`                    | `descripcio`                   | `string`   | Sense transformació |
| `categoria`                     | `categoria`                    | `string`   | Sense transformació |
| `valoracio`                     | `valoracio`                    | `number?`  | Opcional            |
| `imatge`                        | `imatge`                       | `string`   | Sense transformació |
| `popular`                       | `esPopular`                    | `boolean?` | Canvi de nom        |
| `preu`                          | —                              | `number?`  | No es mapeja        |
| `stock`                         | —                              | `number?`  | No es mapeja        |

## Adaptadors

- `adaptarElementApi(apiResponse): ElementCataleg`
- `adaptarElementsApi(apiResponses): ElementCataleg[]`

Aquests adaptadors centralitzen la conversió de camps abans d'arribar als components.
