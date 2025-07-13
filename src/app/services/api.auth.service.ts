import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { LangService } from './lang.service';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService extends BaseApiService {
  private readonly http: HttpClient;
  constructor(http: HttpClient, langService: LangService) {
    super(langService);
    this.http = http;
  }

  setAlertOutOfRanking(alertOutOfRanking: boolean) {
    return this.http.post<any>(
      `${this.apiUrl}/users/set-alert-out-of-ranking`,
      {
        alertOutOfRanking,
      },
      {
        withCredentials: true,
      }
    );
  }

  getAlertOutOfRanking() {
    return this.http.get<any>(`${this.apiUrl}/users/get-alert-out-of-ranking`, {
      withCredentials: true,
    });
  }

  // on interroge l'api pour savoir si le resetoken existe et est valide
  checkResetToken(resetToken: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/users/check-reset-token`,
      { resetToken },
      {
        withCredentials: true,
      }
    );
  }

  forgotPassword(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/forgot-password`, user, {
      withCredentials: true,
    });
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, user, {
      withCredentials: true,
    });
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/login`, user, {
      withCredentials: true,
    });
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/users/reset-password`,
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
