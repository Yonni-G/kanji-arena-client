import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/partials/header/header.component';
import { FooterComponent } from './pages/partials/footer/footer.component';
import { MessageComponent } from './pages/partials/message/message.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // Injection du service AuthService
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);
  
  ngOnInit(): void {
    // Vérifie si le token est présent dans le sessionStorage
    const token = this.authService.getAccessTokenFromStorage();
    if (token) {
      // TODO : vérifier la validité du token
      // Décode le token pour récupérer le nom d'utilisateur
      const username = this.authService.getUsernameFromToken();

      if (!username) {
        this.authService.logout();
        return;
      }
      
      // Met à jour le nom d'utilisateur
      this.authService.setUsername$(username);
      // Met à jour l'accessToken
      this.authService.setAccessToken$(token);
    } else {
      // le user n'est pas connecté mais il possède peut-être un refreshToken dans le cookie http only
      // on interroge l'api pour savoir si le refreshToken existe et est valide
      this.authService.checkRefreshToken().subscribe({
        next: (response) => {
          // Si le refreshToken est valide :
          // on stocke le token dans le sessionStorage
          this.authService.setAccessTokenFromStorage(response.accessToken);
          const username =
            this.authService.getUsernameFromToken();
          // Met à jour le nom d'utilisateur
          this.authService.setUsername$(username!);
          // Met à jour l'accessToken
          this.authService.setAccessToken$(response.token);
        },
        error: (error) => {
          //this.router.navigate(['/login']);
        },
      });
    }
  }
}
