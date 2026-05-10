import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../serveis/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticat()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};