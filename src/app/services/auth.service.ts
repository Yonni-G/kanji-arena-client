import { inject, Injectable } from '@angular/core';
import { ApiAuthService } from './api.auth.service';
import { User } from '../models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly apiService: ApiAuthService = inject(ApiAuthService);
  private readonly jwtHelper: JwtHelperService = inject(JwtHelperService);

  private readonly username$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  ACCESS_TOKEN = 'accessToken';

  isAuthenticated(): boolean {
    const token = this.getAccessTokenFromStorage();
    if (!token) return false;

    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      console.warn('Token malformé ou invalide', e);
      return false;
    }
  }

  checkResetToken(resetToken: string): Observable<any> {
    return this.apiService.checkResetToken(resetToken);
  }

  getAccessTokenFromStorage(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  setAccessTokenIntoStorage(val: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, val);
  }

  getUsernameFromToken(): string | null {
    const decodedToken = this.jwtHelper.decodeToken(
      this.getAccessTokenFromStorage() || ''
    );
    return decodedToken ? decodedToken.username : null;
  }

  getUsername$(): Observable<string | null> {
    return this.username$.asObservable();
  }

  setUsername$(username: string): void {
    this.username$.next(username);
  }

  register(user: User): Observable<any> {
    return this.apiService.register(user);
  }

  forgotPassword(user: User): Observable<any> {
    return this.apiService.forgotPassword(user);
  }

  login(user: User): Observable<any> {
    return this.apiService.login(user).pipe(
      tap((response) => {
        // Met à jour l'accessToken
        //this.accessToken$.next(response.accessToken);
        // Stocke le token dans le LocalStorage
        this.setAccessTokenIntoStorage(response.accessToken);
        this.username$.next(this.getUsernameFromToken());
      })
    );
  }

  logout(): void {
    // Supprimer les informations d'authentification localement
    localStorage.removeItem(this.ACCESS_TOKEN);
    this.username$.next(null);
    this.router.navigate(['/login']);
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.apiService.resetPassword(token, password, confirmPassword);
  }
}
