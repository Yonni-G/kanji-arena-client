import { Component, inject} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/partials/header/header.component';
import { FooterComponent } from './pages/partials/footer/footer.component';
import { MessageComponent } from './pages/partials/message/message.component';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService)

  ngOnInit(): void {
    const token = this.authService.getAccessTokenFromStorage();

    if (token) {
      // 🔐 Vérifie l’expiration du token
      const isExpired = this.jwtHelper.isTokenExpired(token);

      if (isExpired) {
        this.messageService.setMessage({
          text: 'Votre session a expiré, il est temps de vous reconnecter :)',
          type: 'info',
        });
        this.authService.logout();
        this.router.navigate(['/login']);
        return;
      }

      // ✅ sinon : initialise comme prévu
      const username = this.authService.getUsernameFromToken();

      if (!username) {
        this.authService.logout();
        return;
      }

      this.authService.setUsername$(username);
    }
  }
}
