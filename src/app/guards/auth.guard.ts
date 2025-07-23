import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuth = this.auth.isAuthenticated();

    // Si pas authentifié, redirige vers login
    if (!isAuth) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // Si utilisateur connecté essaie d'aller à la racine (''), redirige vers dashboard
    if (isAuth && state.url === '/') {
      this.router.navigate(['/dashboard/my-learning-space']);
      return false;
    }

    // Sinon laisse accéder à la page demandée
    return true;
  }
}
