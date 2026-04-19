import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { ElementService } from '../serveis/element.service';

/**
 * Validador asíncron que comprova si un codi d'element està disponible
 */
export function codiDisponibleValidator(elementService: ElementService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const terme = String(control.value ?? '').trim();

    if (!terme || terme.length < 2 || terme.length > 50) {
      return of(null);
    }

    return of(terme).pipe(
      delay(500),
      switchMap((termeActual) => elementService.teResultatsPerTerme(termeActual)),
      map((teResultats) => teResultats ? null : { sensResultats: true })
    );
  };
}