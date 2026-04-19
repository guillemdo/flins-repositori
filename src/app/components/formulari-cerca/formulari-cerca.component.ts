import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementService } from '../../serveis/element.service';
import { codiDisponibleValidator } from '../../validadors/codi-disponible.validator';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-formulari-cerca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulari-cerca.component.html',
  styleUrl: './formulari-cerca.component.scss'
})
export class FormulariCercaComponent implements OnInit {
  formulariCerca!: FormGroup;
  vistaActiva: 'populars' | 'totes' | 'cerca' | null = 'totes';

  constructor(
    private fb: FormBuilder,
    private elementService: ElementService
  ) {}

  ngOnInit(): void {
    this.formulariCerca = this.fb.group({
      termeCerca: ['', 
        [
          Validators.minLength(2),
          Validators.maxLength(50)
        ],
        [codiDisponibleValidator(this.elementService)]
      ]
    });

    // Cerca automàtica amb debounce a partir de 2 caràcters
    this.formulariCerca.get('termeCerca')?.valueChanges
      .pipe(
        debounceTime(400),
        map((terme) => String(terme ?? '').trim()),
        distinctUntilChanged()
      )
      .subscribe(terme => {
        if (!terme) {
          this.vistaActiva = 'totes';
          this.elementService.obtenirTots();
          return;
        }

        if (terme.length >= 2 && terme.length <= 50) {
          this.vistaActiva = 'cerca';
          this.elementService.cercar(terme);
        }
      });
  }

  cercar(): void {
    const terme = String(this.formulariCerca.get('termeCerca')?.value ?? '').trim();
    this.vistaActiva = terme ? 'cerca' : 'totes';
    this.elementService.cercar(terme);
  }

  netejar(): void {
    this.formulariCerca.reset({ termeCerca: '' }, { emitEvent: false });
    this.vistaActiva = 'totes';
    this.elementService.obtenirTots();
  }

  mostrarPopulars(): void {
    this.formulariCerca.reset({ termeCerca: '' }, { emitEvent: false });
    this.vistaActiva = 'populars';
    this.elementService.obtenirPopulars();
  }

  mostrarTotes(): void {
    this.formulariCerca.reset({ termeCerca: '' }, { emitEvent: false });
    this.vistaActiva = 'totes';
    this.elementService.obtenirTots();
  }

  toggleLlistat(): void {
    if (this.vistaActiva === 'populars') {
      this.mostrarTotes();
      return;
    }

    this.mostrarPopulars();
  }

  get textBotoLlistat(): string {
    return this.vistaActiva === 'populars' ? 'Mostrar Totes' : 'Mostrar Populars';
  }

  get estaCarregant(): boolean {
    return this.elementService.estat() === 'carregant';
  }

  get termeInvalid(): boolean {
    const control = this.formulariCerca.get('termeCerca');
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  get missatgeError(): string {
    const control = this.formulariCerca.get('termeCerca');
    if (control?.hasError('minlength')) {
      return 'Mínim 2 caràcters';
    }
    if (control?.hasError('maxlength')) {
      return 'Màxim 50 caràcters';
    }
    if (control?.hasError('sensResultats')) {
      return 'No hi ha resultats per a aquesta cerca';
    }
    return '';
  }
  
  get termePendient(): boolean {
    const control = this.formulariCerca.get('termeCerca');
    return !!(control?.pending);
  }

  get termeValidant(): boolean {
    const control = this.formulariCerca.get('termeCerca');
    return !!(control?.pending && control?.touched);
  }
}