import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementService } from '../../serveis/element.service';
import { PreferitsService } from '../../serveis/preferits.service';
import { FormulariCercaComponent } from '../formulari-cerca/formulari-cerca.component';
import { PreferitsPanelComponent } from '../preferits-panel/preferits-panel.component';
import { ElementCataleg } from '../../models/element.model';

@Component({
  selector: 'app-cataleg-page',
  standalone: true,
  imports: [CommonModule, FormulariCercaComponent, PreferitsPanelComponent],
  templateUrl: './cataleg-page.component.html',
  styleUrl: './cataleg-page.component.scss'
})
export class CatalegPageComponent implements OnInit {
  constructor(
    public elementService: ElementService,
    public preferitsService: PreferitsService
  ) {}

  ngOnInit(): void {
    this.elementService.obtenirTots();
  }

  reintentar(): void {
    this.elementService.obtenirTots();
  }

  togglePreferit(element: ElementCataleg): void {
    if (this.preferitsService.esPreferit(element.id)) {
      this.preferitsService.eliminarPreferit(element.id);
    } else {
      this.preferitsService.afegirPreferit(element);
    }
  }
}