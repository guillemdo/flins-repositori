import { ElementCataleg, ElementApiResponse } from '../models/element.model';

export function adaptarElementApi(apiResponse: ElementApiResponse): ElementCataleg {
  return {
    id: apiResponse.id,
    nom: apiResponse.nom,
    descripcio: apiResponse.descripcio,
    categoria: apiResponse.categoria,
    valoracio: apiResponse.valoracio,
    imatge: apiResponse.imatge,
    esPopular: apiResponse.popular,
  };
}

export function adaptarElementsApi(apiResponses: ElementApiResponse[]): ElementCataleg[] {
  return apiResponses.map(adaptarElementApi);
}

export function elementBuit(): ElementCataleg {
  return {
    id: '',
    nom: '',
    descripcio: '',
    categoria: '',
    valoracio: 0,
    imatge: 'https://via.placeholder.com/300x200?text=Sense+imatge',
    esPopular: false,
  };
}
