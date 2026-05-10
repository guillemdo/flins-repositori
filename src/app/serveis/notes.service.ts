import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly CLAU_STORAGE = 'notes-elements';
  private readonly notesSignal = signal<Record<string, string[]>>({});

  constructor() {
    this.carregarNotes();
  }

  private carregarNotes(): void {
    try {
      const dades = localStorage.getItem(this.CLAU_STORAGE);
      this.notesSignal.set(dades ? (JSON.parse(dades) as Record<string, string[]>) : {});
    } catch {
      this.notesSignal.set({});
    }
  }

  private desar(): void {
    localStorage.setItem(this.CLAU_STORAGE, JSON.stringify(this.notesSignal()));
  }

  obtenirNotes(elementId: string): string[] {
    return this.notesSignal()[elementId] ?? [];
  }

  totalNotes(elementId: string): number {
    return this.obtenirNotes(elementId).length;
  }

  afegirNota(elementId: string, nota: string): void {
    this.notesSignal.update(notes => ({
      ...notes,
      [elementId]: [...(notes[elementId] ?? []), nota]
    }));
    this.desar();
  }

  eliminarNota(elementId: string, index: number): void {
    this.notesSignal.update(notes => {
      const actuals = [...(notes[elementId] ?? [])];
      actuals.splice(index, 1);
      return { ...notes, [elementId]: actuals };
    });
    this.desar();
  }
}
