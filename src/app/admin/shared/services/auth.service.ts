import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FbAuthResponse, User } from '../../../shared/interfaces';

@Injectable()
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  constructor( private http: HttpClient ) {
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }

    return localStorage.getItem('fb-token');
  }

  login( user: User ): Observable<any> {
    // to get Expiration of token
    user.returnSecureToken = true;
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ environment.apiKey }`, user)
               .pipe(
                 tap(this.setToken),
                 catchError(this.handleError.bind(this))
               );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError( error: HttpErrorResponse ) {
    const { message } = error.error.error;

    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('No such email found')
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password')
        break;
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email')
        break;
    }

    return throwError(error);
  }

  private setToken( response: FbAuthResponse | null ) {
    if (!response) {
      localStorage.clear();
      return;
    }

    const expiresDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
    localStorage.setItem('fb-token', response.idToken);
    localStorage.setItem('fb-token-exp', expiresDate.toString());
  }
}
