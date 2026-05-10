import { Routes } from '@angular/router';

import { CatalegPageComponent } from './components/cataleg-page/cataleg-page.component';
import { CercaPageComponent } from './components/cerca-page/cerca-page.component';
import { DetallPageComponent } from './components/detall-page/detall-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'cataleg',
		pathMatch: 'full'
	},
	{
		path: 'cataleg',
		component: CatalegPageComponent
	},
	{
		path: 'cerca',
		component: CercaPageComponent
	},
	{
		path: 'detall/:id',
		component: DetallPageComponent
	},
	{
		path: 'preferits',
		loadComponent: () =>
			import('./components/preferits-page/preferits-page.component').then(m => m.PreferitsPageComponent),
			// Importació DINÀMICA → genera un chunk separat (lazy loading)
			// com que els preferits només es poden veure si l'usuari està autenticat, només carrega quan es necessari.
		canActivate: [authGuard]
	},
	{
		path: 'login',
		component: LoginPageComponent
	},
	{
		// Wildcard: captura qualsevol URL no reconeguda i la redirigeix
		// cap a la ruta principal del catàleg.
		// Es posa al final perquè no capturi rutes vàlides que encara no s'han processat.
		path: '**',
		redirectTo: 'cataleg'
	}
];
