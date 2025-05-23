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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private readonly authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.includes('/check-refresh-token') ||
      req.url.includes('/check-reset-token') ||
      req.url.includes('/login') ||
      req.url.includes('/logout') ||
      req.url.includes('/reset-password')
    ) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessTokenFromStorage();

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
            this.authService.setAccessTokenFromStorage(newToken);
            this.authService.setAccessToken$(newToken);
            
          }
        }
      }),
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.isRefreshing
        ) {
          this.isRefreshing = true;

          return this.authService.checkRefreshToken().pipe(
            switchMap((response: any) => {
              const newToken = response.accessToken;
              this.authService.setAccessToken$(newToken);

              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });

              this.isRefreshing = false;
              return next.handle(newReq);
            }),
            catchError((err) => {
              this.isRefreshing = false;
              this.authService.logout();
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
