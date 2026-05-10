import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PreferitsService, Preferit } from '../../serveis/preferits.service';
import { NotesService } from '../../serveis/notes.service';

@Component({
  selector: 'app-preferits-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './preferits-panel.component.html',
  styleUrl: './preferits-panel.component.scss'
})
export class PreferitsPanelComponent implements OnInit {
  formularisNotes: Record<string, FormGroup> = {};
  indexNotaNova: Record<string, number | null> = {};
  preferitObert: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public preferitsService: PreferitsService,
    public notesService: NotesService
  ) {}

  ngOnInit(): void {
    this.preferitsService.preferitsDetall().forEach((preferit) => {
      this.inicialitzarFormulari(preferit.elementId);
    });
  }

  private inicialitzarFormulari(elementId: string): void {
    const notes = this.notesService.obtenirNotes(elementId);
    this.formularisNotes[elementId] = this.fb.group({
      notes: this.fb.array(
        notes.map((nota) =>
          this.fb.control(nota, [Validators.required, Validators.minLength(3)])
        )
      )
    });
    this.indexNotaNova[elementId] = null;
  }

  private assegurarFormulari(elementId: string): void {
    if (!this.formularisNotes[elementId]) {
      this.inicialitzarFormulari(elementId);
    }
  }

  obtenirFormulari(elementId: string): FormGroup {
    return this.formularisNotes[elementId];
  }

  obtenirNotes(elementId: string): FormArray {
    return this.formularisNotes[elementId].get('notes') as FormArray;
  }

  alternarPanelNotes(preferit: Preferit, event: Event): void {
    event.stopPropagation();
    this.assegurarFormulari(preferit.elementId);
    this.preferitObert = this.preferitObert === preferit.elementId ? null : preferit.elementId;
  }

  anarADetall(elementId: string): void {
    this.router.navigate(['/detall', elementId]);
  }

  obrirEditorNotes(preferit: Preferit, event: Event): void {
    event.stopPropagation();
    this.assegurarFormulari(preferit.elementId);
    if (this.preferitObert !== preferit.elementId) {
      this.preferitObert = preferit.elementId;
    }
    this.afegirCampNota(preferit.elementId);
  }

  afegirCampNota(elementId: string): void {
    if (this.indexNotaNova[elementId] !== null && this.indexNotaNova[elementId] !== undefined) {
      return;
    }
    const notes = this.obtenirNotes(elementId);
    notes.push(this.fb.control('', [Validators.required, Validators.minLength(3)]));
    this.indexNotaNova[elementId] = notes.length - 1;
  }

  teNotaNovaValida(elementId: string): boolean {
    const index = this.indexNotaNova[elementId];
    if (index === null || index === undefined) {
      return false;
    }
    const control = this.obtenirNotes(elementId).at(index);
    return !!control?.valid;
  }

  afegirNota(elementId: string): void {
    const index = this.indexNotaNova[elementId];
    if (index === null || index === undefined) {
      return;
    }
    const notes = this.obtenirNotes(elementId);
    const control = notes.at(index);
    control.markAsTouched();

    if (control.valid) {
      const nota = String(control.value ?? '').trim();
      this.notesService.afegirNota(elementId, nota);
      this.indexNotaNova[elementId] = null;
      this.inicialitzarFormulari(elementId);
    }
  }

  eliminarNota(elementId: string, index: number): void {
    const indexNova = this.indexNotaNova[elementId];

    if (indexNova === index) {
      this.obtenirNotes(elementId).removeAt(index);
      this.indexNotaNova[elementId] = null;
      return;
    }

    if (indexNova !== null && indexNova !== undefined && index < indexNova) {
      this.indexNotaNova[elementId] = indexNova - 1;
    }

    const novaNotaValor = (indexNova !== null && indexNova !== undefined)
      ? String(this.obtenirNotes(elementId).at(indexNova)?.value ?? '')
      : null;

    this.notesService.eliminarNota(elementId, index);
    this.inicialitzarFormulari(elementId);

    if (novaNotaValor !== null) {
      const notesRebuild = this.obtenirNotes(elementId);
      notesRebuild.push(this.fb.control(novaNotaValor, [Validators.required, Validators.minLength(3)]));
      this.indexNotaNova[elementId] = notesRebuild.length - 1;
    }
  }

  eliminarPreferit(elementId: string): void {
    this.preferitsService.eliminarPreferit(elementId);
    delete this.formularisNotes[elementId];
    delete this.indexNotaNova[elementId];
    if (this.preferitObert === elementId) {
      this.preferitObert = null;
    }
  }
}