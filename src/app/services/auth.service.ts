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

  private readonly accessToken$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
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

  checkRefreshToken(): Observable<any> {
    return this.apiService.checkRefreshToken();
  }

  checkResetToken(resetToken: string): Observable<any> {
    return this.apiService.checkResetToken(resetToken);
  }

  test(): Observable<any> {
    return this.apiService.getTestMessage();
  }

  getAccessTokenFromStorage(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN);
  }

  setAccessTokenFromStorage(val: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN, val);
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

  setAccessToken$(token: string): void {
    this.accessToken$.next(token);
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
        this.accessToken$.next(response.accessToken);
        // Stocke le token dans le sessionStorage
        this.setAccessTokenFromStorage(response.accessToken);
        this.username$.next(this.getUsernameFromToken());
      })
    );
  }

  logout(): void {
    // Supprimer les informations d'authentification localement (indépendamment du succès ou de l'échec de la déconnexion distante)
    sessionStorage.removeItem(this.ACCESS_TOKEN);
    this.accessToken$.next(null);
    this.username$.next(null);

    // Maintenant tenter de faire le logout à distance
    this.apiService.logout().subscribe({
      next: () => {
        // Si la déconnexion distante réussit, rediriger vers la page de login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // En cas d'échec de la déconnexion distante, simplement afficher une erreur, mais ne pas empêcher la déconnexion locale
        console.error(
          'Échec de la déconnexion à distance :',
          error.message,
          error
        );
        // Tu peux également gérer un message utilisateur pour indiquer qu'il y a eu une erreur sur la déconnexion distante, mais que localement l'utilisateur est déconnecté.
      },
    });
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.apiService.resetPassword(token, password, confirmPassword);
  }
}
