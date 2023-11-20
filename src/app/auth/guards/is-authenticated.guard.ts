import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  // console.log( "isAuthenticatedGuard" );
  // console.log( { route, state } );

  const authService = inject( AuthService );
  // console.log( { status: authService.authStatus() } );
  const router = inject( Router );

  if ( authService.authStatus() === AuthStatus.checking ) return false;

  if ( authService.authStatus() === AuthStatus.authenticated ) return true;

  // const url = state.url;
  // console.log( { url } );
  // localStorage.setItem( "url", url );

  router.navigateByUrl( "/auth/login" );
  return false;
};
