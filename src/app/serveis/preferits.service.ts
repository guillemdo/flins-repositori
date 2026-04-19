import { Injectable, Signal, computed, signal } from '@angular/core';
import { ElementCataleg } from '../models/element.model';

export interface Preferit {
  elementId: string;
  elementNom: string;
  element: ElementCataleg;
  notes: string[];
  dataAfegit: Date;
}

interface PreferitPersistit {
  elementId: string;
  elementNom: string;
  element?: ElementCataleg;
  notes?: string[];
  dataAfegit: string | Date;
}

@Injectable({
  providedIn: 'root'
})
export class PreferitsService {
  private readonly CLAU_STORAGE = 'preferits-cataleg';
  private readonly preferitsDetallSignal = signal<Preferit[]>([]);

  readonly preferitsDetall: Signal<Preferit[]> = this.preferitsDetallSignal.asReadonly();
  readonly preferits: Signal<ElementCataleg[]> = computed(() =>
    this.preferitsDetallSignal().map((preferit) => preferit.element)
  );
  readonly totalPreferits: Signal<number> = computed(() => this.preferits().length);

  constructor() {
    this.carregarPreferits();
  }

  private carregarPreferits(): void {
    try {
      const dades = localStorage.getItem(this.CLAU_STORAGE);
      if (!dades) {
        this.preferitsDetallSignal.set([]);
        return;
      }

      const preferits = JSON.parse(dades) as PreferitPersistit[];
      const preferitsNormalitzats: Preferit[] = preferits.map((p) => {
        const elementNormalitzat: ElementCataleg = p.element ?? {
          id: p.elementId,
          nom: p.elementNom,
          descripcio: '',
          categoria: '',
          imatge: ''
        };

        return {
          elementId: p.elementId,
          elementNom: p.elementNom,
          element: elementNormalitzat,
          notes: Array.isArray(p.notes) ? p.notes : [],
          dataAfegit: new Date(p.dataAfegit)
        };
      });

      this.preferitsDetallSignal.set(preferitsNormalitzats);
    } catch (error) {
      console.error('Error carregant preferits:', error);
      this.preferitsDetallSignal.set([]);
    }
  }

  private desarPreferits(): void {
    try {
      localStorage.setItem(this.CLAU_STORAGE, JSON.stringify(this.preferitsDetallSignal()));
    } catch (error) {
      console.error('Error desant preferits:', error);
    }
  }

  afegirPreferit(element: ElementCataleg): void {
    if (this.esPreferit(element.id)) {
      return;
    }

    const nouPreferit: Preferit = {
      elementId: element.id,
      elementNom: element.nom,
      element,
      notes: [],
      dataAfegit: new Date()
    };

    this.preferitsDetallSignal.update((preferits) => [...preferits, nouPreferit]);
    this.desarPreferits();
  }

  eliminarPreferit(id: string): void {
    this.preferitsDetallSignal.update((preferits) =>
      preferits.filter((preferit) => preferit.elementId !== id)
    );
    this.desarPreferits();
  }

  esPreferit(id: string): boolean {
    return this.preferitsDetallSignal().some((preferit) => preferit.elementId === id);
  }

  afegirNota(elementId: string, nota: string): void {
    this.preferitsDetallSignal.update((preferits) =>
      preferits.map((preferit) => {
        if (preferit.elementId === elementId) {
          return { ...preferit, notes: [...preferit.notes, nota] };
        }
        return preferit;
      })
    );
    this.desarPreferits();
  }

  actualitzarNotes(elementId: string, notes: string[]): void {
    this.preferitsDetallSignal.update((preferits) =>
      preferits.map((preferit) => {
        if (preferit.elementId === elementId) {
          return { ...preferit, notes };
        }
        return preferit;
      })
    );
    this.desarPreferits();
  }

  eliminarNota(elementId: string, indexNota: number): void {
    this.preferitsDetallSignal.update((preferits) =>
      preferits.map((preferit) => {
        if (preferit.elementId === elementId) {
          const notesActualitzades = [...preferit.notes];
          notesActualitzades.splice(indexNota, 1);
          return { ...preferit, notes: notesActualitzades };
        }
        return preferit;
      })
    );
    this.desarPreferits();
  }

  obtenirPreferit(elementId: string): Preferit | undefined {
    return this.preferitsDetallSignal().find((preferit) => preferit.elementId === elementId);
  }
}
