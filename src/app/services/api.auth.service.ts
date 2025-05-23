import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {
  constructor(private readonly http: HttpClient) {}

  setAlertOutOfRanking(alertOutOfRanking: boolean) {
    return this.http.post<any>(
      `${environment.apiUrl}/users/set-alert-out-of-ranking`,
      {
        alertOutOfRanking,
      },
      {
        withCredentials: true,
      }
    );
  }

  // on interroge l'api pour savoir si le refreshToken existe et est valide
  checkRefreshToken(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/users/check-refresh-token`,
      {
        withCredentials: true,
      }
    );
  }

  // on interroge l'api pour savoir si le resetoken existe et est valide
  checkResetToken(resetToken: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/users/check-reset-token`,
      { resetToken },
      {
        withCredentials: true,
      }
    );
  }

  // Méthode pour récupérer le message depuis la route /test
  getTestMessage(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/test`, {
      withCredentials: true,
    });
  }

  getTestProtected(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/protected`, {
      withCredentials: true,
    });
  }

  forgotPassword(user: User): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/users/forgot-password`,
      user,
      {
        withCredentials: true,
      }
    );
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/register`, user, {
      withCredentials: true,
    });
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, user, {
      withCredentials: true,
    });
  }

  // Méthode pour se déconnecter
  logout(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/users/logout`,
      {},
      { withCredentials: true }
    );
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/users/reset-password`,
      { token, password, confirmPassword },
      { withCredentials: true }
    );
  }

  // Gérer les erreurs globales
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      // Si le token est expiré ou invalide, on pourrait essayer de rafraîchir le token
      // C'est ici que tu pourrais gérer la logique de rafraîchissement dans ton service
      console.error('Token expiré ou invalide', error);
    }
    return throwError(
      () => new Error(error.message || 'Une erreur est survenue')
    );
  }
}
