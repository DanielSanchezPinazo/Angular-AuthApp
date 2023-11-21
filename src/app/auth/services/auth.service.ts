import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';

import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { RegisterResponse } from '../interfaces/register-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _baseUrl: string = environment.baseUrl;
  private _http = inject( HttpClient );

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );

  constructor() {

    this.checkAuthStatus().subscribe();
   }

  private setAuthentication( user: User, token: string ): boolean {

    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem( "token", token );
    return true;
  };

  login( email: string, password: string ): Observable<boolean> {

    const url = `${ this._baseUrl }/auth/login`;
    // const body = { email: email, password: password }; es igual que lo de abajo
    const body = { email, password };

    return this._http.post<LoginResponse>( url, body )
      .pipe(

        map( ({ user, token }) => this.setAuthentication( user, token )),
        //todo: errores
        catchError( err => {

          // console.log( err );
          return throwError( () => err.error.message );
        })
      );
  };

  register( name: string, email: string, password: string ){//}: Observable<boolean> {

    const url = `${ this._baseUrl }/auth/register`;
    const body = { name, email, password };

    return this._http.post<RegisterResponse>( url, body )
    .pipe(

      map( ({ user, token }) => this.setAuthentication( user, token )),
      catchError( err => {

        console.log( err );
        return throwError( () => err.error.message );
      })
    );
  };

  checkAuthStatus(): Observable<boolean> {

    const url = `${ this._baseUrl }/auth/check-token`;
    const token = localStorage.getItem("token");

    if ( !token ) {

      this.logout();
      return of( false );
    };

    const headers = new HttpHeaders().set( "Authorization", `Bearer ${ token }` );


    return this._http.get<CheckTokenResponse>( url, { headers } ).pipe(

      map( ({ token, user }) => this.setAuthentication( user, token )),
      catchError( () => {

        this._authStatus.set( AuthStatus.notAuthenticated );
        return of( false );
      })
    );
  };

  logout() {

    localStorage.removeItem("token");
    this._currentUser.set( null );
    this._authStatus.set( AuthStatus.notAuthenticated );

  };
}
