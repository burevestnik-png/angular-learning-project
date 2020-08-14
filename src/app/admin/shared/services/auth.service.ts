import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FbAuthResponse, User } from '../../../shared/interfaces';

@Injectable()
export class AuthService {
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
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ environment.apiKey }`,
      user)
               .pipe(
                 tap(this.setToken)
               );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken( response: FbAuthResponse | null) {
    if (!response) {
      localStorage.clear();
      return
    }

    const expiresDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
    localStorage.setItem('fb-token', response.idToken);
    localStorage.setItem('fb-token-exp', expiresDate.toString());
  }
}
