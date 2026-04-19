
// ens serveix per poder canviar entre api real o mock de forma ràpida,
// només canviant el fitxer d'entorn que es carrega. En aquest cas, el fitxer
// d'entorn de desenvolupament apunta a una API local amb dades simulades,
// mentre que el fitxer d'entorn de producció podria apuntar a una API real en un servidor remot.
// Això ens permet provar i desenvolupar l'aplicació amb dades controlades
// abans de desplegar-la en un entorn real.

/* typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.exemple.com',
  apiKey: 'LA_VOSTRA_CLAU_API' // Si cal autenticació
};
*/

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4301',
  apiDelay: 600
};