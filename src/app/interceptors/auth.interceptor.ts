import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtHelper: JwtHelperService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Routes à ignorer
    // if (
    //   req.url.includes('/check-refresh-token') ||
    //   req.url.includes('/check-reset-token') ||
    //   req.url.includes('/login') ||
    //   req.url.includes('/logout') ||
    //   req.url.includes('/reset-password')
    // ) {
    //   return next.handle(req);
    // }
    
    const accessToken = this.authService.getAccessTokenFromStorage();

    // 🔒 Vérifie si le token est expiré
    if (accessToken && this.jwtHelper.isTokenExpired(accessToken)) {
      this.messageService.setMessage({
        text: "Votre session a expiré, il est temps de vous reconnecter :)",
        type: "info"        
      })
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token expiré'));
    }

    const authReq = accessToken
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : req;

    return next.handle(authReq).pipe(
      tap((event) => {
        // ✅ Si un nouveau token est renvoyé dans les headers de réponse
        if (event instanceof HttpResponse) {
          const newToken = event.headers.get('Authorization')?.split(' ')[1];
          if (newToken) {
            this.authService.setAccessTokenIntoStorage(newToken);
          }
        }
        // on hydrate notre subject username
        this.authService.setUsername$(this.authService.getUsernameFromToken()!);
      }),
      catchError((error) => {
        // ➕ Tu peux gérer ici le 401 ou 403 aussi si tu veux
        return throwError(() => error);
      })
    );
  }
}
