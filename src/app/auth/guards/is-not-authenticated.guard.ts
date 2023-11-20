import { inject } from '@angular/core';
import { CanActivateFn, GuardsCheckEnd, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

// PublicGuard - PrivateGuard

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const router = inject( Router );

  if ( authService.authStatus() === AuthStatus.authenticated ) {

    console.log("Guard impide volver a Login");
    // router.navigateByUrl( "/dashboard" );
    return false;
  };

  return true;
};
