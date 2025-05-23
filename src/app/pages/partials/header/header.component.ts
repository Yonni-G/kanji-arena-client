import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ApiAuthService } from '../../../services/api.auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  username: string | null = null;
  isAuthenticated: boolean = false;


  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiAuthService
  ) {
    this.authService.getUsername$().subscribe((username) => {
      this.username = username;
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  logout() {
    this.authService.logout();
  }

  protected(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    this.apiService.getTestProtected().subscribe((response) => {
      //console.log('Réponse protégée:', response);
    });
  }
}
