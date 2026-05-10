# IOC Angular Flins

## 1. Descripcio del projecte

Aplicacio Angular de cataleg de pellicules (Flins) amb navegacio per rutes, vista de detall, autenticació per accedir a preferits, lazy loading de la seccio protegida i optimitzacions de rendiment amb OnPush i virtualitzacio de llista.

## 2. Mapa de rutes

| Path            | Component                            | Acces              |
| --------------- | ------------------------------------ | ------------------ |
| /               | Redireccio a cataleg                 | Public             |
| /cataleg        | CatalegPageComponent                 | Public             |
| /cerca          | CercaPageComponent                   | Public             |
| /detall/:id     | DetallPageComponent                  | Public             |
| /preferits      | PreferitsPageComponent (lazy loaded) | Privat (authGuard) |
| /login          | LoginPageComponent                   | Public             |
| \*\* (wildcard) | Redireccio a cataleg                 | Public             |

## 3. Instruccions d'execució en local

git clone [url-repositori]
cd [nom-projecte]
npm install
ng serve

Obrir http://localhost:4200

## 4. Build de produccio

Comanda:
ng build --configuration production

Resultat:
El build completa correctament i genera els fitxers a la carpeta dist/.

Mida aproximada del bundle obtinguda:

- Initial total: 406.61 kB (Estimated transfer size: 104.95 kB)
- Chunk inicial principal: chunk-QCXL4CEJ.js 300.60 kB
- Main: main-OHGS2BI6.js 71.24 kB
- Polyfills: polyfills-FFHMD2TL.js 34.52 kB
- Lazy chunk (preferits): chunk-GCJU7VVB.js 13.54 kB

Nota:
Durant el build poden apareixer warnings de pressupost d'estils de component, però no hi ha errors de compilació.

## 5. Credencials de prova

Email: Usuari@test.com
Contrasenya: 1234
