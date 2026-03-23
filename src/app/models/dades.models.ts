export interface Dades {
  id: number;
  titol: string;
  director: string;
  protagonistes: string;
  valoracio?: number; // ? vol dir variable opcionsl, podem no tenir puntuació.
  imatge: string;
}