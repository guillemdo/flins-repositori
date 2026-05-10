import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ElementCataleg } from '../../models/element.model';
import { ElementService } from '../../serveis/element.service';
import { Preferit, PreferitsService } from '../../serveis/preferits.service';
import { NotesService } from '../../serveis/notes.service';

@Component({
  selector: 'app-detall-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detall-page">
      <a class="link-tornar" routerLink="/cataleg">← Tornar al catàleg</a>

      <div class="estat-carregant" *ngIf="carregant">
        <div class="spinner"></div>
        <p>Carregant detall...</p>
      </div>

      <section class="detall-card" *ngIf="!carregant && element">
        <button class="btn-estrella" [class.actiu]="preferitsService.esPreferit(element.id)" (click)="togglePreferit()">
          {{ preferitsService.esPreferit(element.id) ? '★' : '☆' }}
        </button>

        <img [src]="element.imatge" [alt]="element.nom" class="detall-imatge">

        <div class="detall-contingut">
          <div class="detall-top">
            <p class="detall-id">ID: {{ element.id }}</p>
            <h1>{{ element.nom }}</h1>
          </div>
          <div class="detall-bottom">
            <p class="detall-categoria">{{ element.categoria }}</p>
            <p class="detall-descripcio">{{ element.descripcio }}</p>
            <p class="detall-valoracio" *ngIf="element.valoracio !== undefined && element.valoracio !== null">
              <span class="valoracio-icona">★</span>
              <span class="valoracio-nota">{{ element.valoracio | number:'1.1-1' }}</span>
              <span class="valoracio-max">/ 5</span>
            </p>
          </div>
        </div>

        <section class="notes-seccio">
          <div class="notes-capcalera">
            <h2>Notes</h2>

            <div class="notes-row">
              <p class="notes-count" (click)="alternarPanelNotes()">{{ notesService.totalNotes(element.id) }} Notes</p>
              <button type="button" class="btn-nova-nota" (click)="obrirEditorNotes()">+</button>
            </div>
          </div>

          <div class="notes-inline" *ngIf="notesObertes && formulariNotes">
            <form [formGroup]="formulariNotes">
              <div class="notes-llista" formArrayName="notes">
                <div class="nota-item" *ngFor="let notaControl of obtenirNotes().controls; let i = index">
                  <input
                    type="text"
                    [formControlName]="i"
                    [placeholder]="i === indexNotaNova ? 'Escriu una nova nota...' : 'Nota ' + (i + 1)"
                    class="input-nota"
                    [class.invalid]="notaControl.invalid && notaControl.touched"
                    [readonly]="i !== indexNotaNova"
                  >
                  <button type="button" class="btn-eliminar-nota" (click)="eliminarNota(i)">✕</button>
                </div>
              </div>

              <button type="button" class="btn-afegir-nota" (click)="afegirNota()" [disabled]="!teNotaNovaValida()">
                Afegir nota
              </button>
            </form>
          </div>
        </section>
      </section>

      <section class="estat-error" *ngIf="!carregant && !element">
        <h2>Element no trobat</h2>
        <p>No existeix cap element associat a aquest identificador.</p>
      </section>
    </div>
  `,
  styles: [`
    .detall-page {
      position: relative;
      z-index: 0;
      max-width: 935px;
      margin: 0 auto;
      min-height: 100vh;
      padding: 2rem;
    }

    .detall-page::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url('/BackgroundPride.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: -1;
      pointer-events: none;
    }

    .link-tornar {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: #36243d;
      text-decoration: none;
      font-weight: 600;
    }

    .detall-card {
      position: relative;
      display: grid;
      grid-template-columns: minmax(280px, 380px) 1fr;
      align-items: stretch;
      gap: 2rem;
      background: rgba(255, 255, 255, 0.92);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 20px 45px rgba(39, 12, 44, 0.15);
    }

    .btn-estrella {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: white;
      border: 2px solid #f39c12;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1;
    }

    .btn-estrella:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-estrella.actiu {
      background-color: #f39c12;
      color: white;
    }

    .detall-imatge {
      width: 100%;
      height: 100%;
      min-height: 300px;
      object-fit: cover;
      border-radius: 18px;
    }

    .detall-id,
    .detall-categoria {
      margin: 0;
      color: #7a4a85;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.85rem;
    }

    .detall-contingut {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .detall-top {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .detall-bottom {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    h1 {
      margin: 10px 0 0;
      color: #af2fcf;
      font-size: 3rem;
    }

    .detall-descripcio {
      margin: 0;
      color: #372f39;
      font-size: 1.05rem;
      line-height: 1.5;
    }

    .detall-valoracio {
      margin: 0;
      font-size: 1.05rem;
      color: #6b4f00;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .valoracio-icona {
      color: #f39c12;
    }

    .valoracio-nota {
      font-weight: 700;
    }

    .valoracio-max {
      color: #8a6d1f;
      font-weight: 500;
    }

    .notes-seccio {
      grid-column: 1 / -1;
      margin-top: 1rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(122, 74, 133, 0.2);
    }

    .notes-capcalera {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .notes-capcalera h2 {
      margin: 0;
      color: #36243d;
      font-size: 1.35rem;
    }

    .notes-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .notes-count {
      margin: 0;
      color: #7a4a85;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-nova-nota,
    .btn-eliminar-nota,
    .btn-afegir-nota {
      border: none;
      cursor: pointer;
    }

    .btn-nova-nota {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #36243d7a;
      color: white;
      font-size: 1.2rem;
      font-weight: 700;
    }

    .notes-inline {
      background: rgba(255, 248, 251, 0.85);
      border: 1px solid rgba(175, 47, 207, 0.18);
      border-radius: 18px;
      padding: 1rem;
    }

    .notes-llista {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .nota-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.75rem;
      align-items: center;
    }

    .input-nota {
      width: 100%;
      border: 1px solid rgba(122, 74, 133, 0.35);
      border-radius: 12px;
      padding: 0.85rem 1rem;
      font-size: 0.98rem;
      background: white;
    }

    .input-nota.invalid {
      border-color: #e74c3c;
    }

    .btn-eliminar-nota {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #fff0d9;
      color: #6b4f00;
      font-size: 1rem;
      font-weight: 700;
    }

    .btn-afegir-nota {
      border-radius: 999px;
      background: #fff0d9;
      color: #6b4f00;
      padding: 0.8rem 1.15rem;
      font-weight: 700;
    }

    .btn-afegir-nota:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .estat-carregant,
    .estat-error {
      text-align: center;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.92);
      border-radius: 24px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 1rem;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
      .detall-card {
        grid-template-columns: 1fr;
      }

      .notes-capcalera {
        flex-direction: column;
        align-items: flex-start;
      }

      h1 {
        font-size: 2.3rem;
      }
    }
  `]
})
export class DetallPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly elementService = inject(ElementService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly preferitsService = inject(PreferitsService);
  readonly notesService = inject(NotesService);

  element: ElementCataleg | null = null;
  carregant = true;
  formulariNotes: FormGroup | null = null;
  indexNotaNova: number | null = null;
  notesObertes = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.carregant = false;
      this.cdr.markForCheck();
      return;
    }

    this.elementService.obtenirPerId(id).subscribe((element) => {
      this.element = element;
      this.carregant = false;

      if (element) {
        this.sincronitzarFormulariNotes();
      }

      // OnPush + subscribe asíncron: cal marcar el component perquè es refresqui la vista.
      this.cdr.markForCheck();
    });
  }

  togglePreferit(): void {
    if (!this.element) {
      return;
    }

    if (this.preferitsService.esPreferit(this.element.id)) {
      this.preferitsService.eliminarPreferit(this.element.id);
      return;
    }

    this.preferitsService.afegirPreferit(this.element);
  }

  obtenirNotes(): FormArray {
    return this.formulariNotes?.get('notes') as FormArray;
  }

  alternarPanelNotes(): void {
    if (!this.element) {
      return;
    }
    this.sincronitzarFormulariNotes();
    this.notesObertes = !this.notesObertes;
  }

  obrirEditorNotes(): void {
    if (!this.element) {
      return;
    }
    this.sincronitzarFormulariNotes();
    if (!this.notesObertes) {
      this.notesObertes = true;
    }
    this.afegirCampNota();
  }

  afegirCampNota(): void {
    if (this.indexNotaNova !== null) {
      return;
    }

    const notes = this.obtenirNotes();
    notes.push(this.fb.control('', [Validators.required, Validators.minLength(3)]));
    this.indexNotaNova = notes.length - 1;
  }

  teNotaNovaValida(): boolean {
    if (this.indexNotaNova === null) {
      return false;
    }

    const control = this.obtenirNotes().at(this.indexNotaNova);
    return !!control?.valid;
  }

  afegirNota(): void {
    if (!this.element || this.indexNotaNova === null) {
      return;
    }

    const notes = this.obtenirNotes();
    const control = notes.at(this.indexNotaNova);
    control.markAsTouched();

    if (control.valid) {
      const nota = String(control.value ?? '').trim();
      this.notesService.afegirNota(this.element.id, nota);
      this.indexNotaNova = null;
      this.sincronitzarFormulariNotes();
      this.notesObertes = true;
    }
  }

  eliminarNota(index: number): void {
    if (!this.element) {
      return;
    }

    if (this.indexNotaNova === index) {
      this.obtenirNotes().removeAt(index);
      this.indexNotaNova = null;
      return;
    }

    if (this.indexNotaNova !== null && index < this.indexNotaNova) {
      this.indexNotaNova = this.indexNotaNova - 1;
    }

    const novaNotaValor = this.indexNotaNova !== null
      ? String(this.obtenirNotes().at(this.indexNotaNova)?.value ?? '')
      : null;

    this.notesService.eliminarNota(this.element.id, index);
    this.sincronitzarFormulariNotes();

    if (novaNotaValor !== null) {
      const notesRebuild = this.obtenirNotes();
      notesRebuild.push(this.fb.control(novaNotaValor, [Validators.required, Validators.minLength(3)]));
      this.indexNotaNova = notesRebuild.length - 1;
    }

    this.notesObertes = true;
  }

  private sincronitzarFormulariNotes(): void {
    if (!this.element) {
      this.formulariNotes = null;
      this.indexNotaNova = null;
      return;
    }

    const notes = this.notesService.obtenirNotes(this.element.id);
    this.formulariNotes = this.fb.group({
      notes: this.fb.array(
        notes.map((nota) =>
          this.fb.control(nota, [Validators.required, Validators.minLength(3)])
        )
      )
    });

    if (this.indexNotaNova !== null && this.indexNotaNova >= this.obtenirNotes().length) {
      this.indexNotaNova = null;
    }
  }
}