import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ElementService } from '../../serveis/element.service';
import { PreferitsService } from '../../serveis/preferits.service';
import { ElementCataleg } from '../../models/element.model';

@Component({
  selector: 'app-cataleg-page',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './cataleg-page.component.html',
  styleUrl: './cataleg-page.component.scss'
})
export class CatalegPageComponent implements OnInit {
  readonly elementsPerFila = 3;
  readonly itemSize = 412;

  constructor(
    public elementService: ElementService,
    public preferitsService: PreferitsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.elementService.obtenirTots();
  }

  reintentar(): void {
    this.elementService.obtenirTots();
  }

  togglePreferit(event: Event, element: ElementCataleg): void {
    event.stopPropagation();
    if (this.preferitsService.esPreferit(element.id)) {
      this.preferitsService.eliminarPreferit(element.id);
    } else {
      this.preferitsService.afegirPreferit(element);
    }
  }

  anarADetall(id: string): void {
    this.router.navigate(['/detall', id]);
  }

  filesVirtuals(): ElementCataleg[][] {
    const elements = this.elementService.elements();
    const files: ElementCataleg[][] = [];

    for (let i = 0; i < elements.length; i += this.elementsPerFila) {
      files.push(elements.slice(i, i + this.elementsPerFila));
    }

    return files;
  }

  trackByFila(index: number): number {
    return index;
  }

  trackByElement(_index: number, element: ElementCataleg): string {
    return element.id;
  }
}