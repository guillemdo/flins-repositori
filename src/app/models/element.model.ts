export interface ElementCataleg {
  id: string;
  nom: string;
  descripcio: string;
  categoria: string;
  valoracio?: number;
  imatge: string;
  esPopular?: boolean;
}

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

export interface ElementsCercaResponse {
  elements: ElementApiResponse[];
  total: number;
}

export type EstatServei = 'inicial' | 'carregant' | 'exit' | 'error';

export interface EstatElements {
  estat: EstatServei;
  elements: ElementCataleg[];
  error?: string;
}