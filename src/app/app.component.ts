import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'authApp';

  private _authService = inject( AuthService );
  private _router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {

    if ( this._authService.authStatus() === AuthStatus.checking ) {

      return false;
    };

    return true;
  });

  public authStatusChangedEffect = effect( () => {

    // console.log( "AuthStatus: ", this._authService.authStatus() );
    switch ( this._authService.authStatus() ) {

      case AuthStatus.checking:
        break;

      case AuthStatus.authenticated:

        this._router.navigateByUrl( "/dashboard" );
        break;


      case AuthStatus.notAuthenticated:

        this._router.navigateByUrl( "/auth/login" );
        break;
    };
  });
}
