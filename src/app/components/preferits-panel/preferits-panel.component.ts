import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PreferitsService, Preferit } from '../../serveis/preferits.service';

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
    public preferitsService: PreferitsService
  ) {}

  ngOnInit(): void {
    this.preferitsService.preferitsDetall().forEach((preferit) => {
      this.inicialitzarFormulari(preferit);
    });
  }

  private inicialitzarFormulari(preferit: Preferit): void {
    this.formularisNotes[preferit.elementId] = this.fb.group({
      notes: this.fb.array(
        preferit.notes.map((nota) =>
          this.fb.control(nota, [Validators.required, Validators.minLength(3)])
        )
      )
    });
    this.indexNotaNova[preferit.elementId] = null;
  }

  private assegurarFormulari(preferit: Preferit): void {
    if (!this.formularisNotes[preferit.elementId]) {
      this.inicialitzarFormulari(preferit);
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
    this.assegurarFormulari(preferit);
    this.preferitObert = this.preferitObert === preferit.elementId ? null : preferit.elementId;
  }

  obrirEditorNotes(preferit: Preferit, event: Event): void {
    event.stopPropagation();
    this.assegurarFormulari(preferit);
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
      this.preferitsService.afegirNota(elementId, nota);
      this.indexNotaNova[elementId] = null;

      const preferitActualitzat = this.preferitsService.obtenirPreferit(elementId);
      if (preferitActualitzat) {
        this.inicialitzarFormulari(preferitActualitzat);
      }
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

    this.preferitsService.eliminarNota(elementId, index);

    const preferitActualitzat = this.preferitsService.obtenirPreferit(elementId);
    if (preferitActualitzat) {
      const indexNovaActual = this.indexNotaNova[elementId];
      const novaNotaValor = (indexNovaActual !== null && indexNovaActual !== undefined)
        ? String(this.obtenirNotes(elementId).at(indexNovaActual)?.value ?? '')
        : null;

      this.inicialitzarFormulari(preferitActualitzat);

      if (novaNotaValor !== null) {
        const notesRebuild = this.obtenirNotes(elementId);
        notesRebuild.push(this.fb.control(novaNotaValor, [Validators.required, Validators.minLength(3)]));
        this.indexNotaNova[elementId] = notesRebuild.length - 1;
      }
    } else {
      delete this.formularisNotes[elementId];
      delete this.indexNotaNova[elementId];
      if (this.preferitObert === elementId) {
        this.preferitObert = null;
      }
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