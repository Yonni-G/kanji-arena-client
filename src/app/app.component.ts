import { Component, inject} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/partials/header/header.component';
import { FooterComponent } from './pages/partials/footer/footer.component';
import { MessageComponent } from './pages/partials/message/message.component';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from './services/message.service';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly router = inject(Router);

  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    // Met à jour le titre à chaque navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        const pageTitle =
          route.snapshot.data['title'] ?
          (route.snapshot.data['title'] + ' | Kanji Arena') :
          'Kanji Arena';
        this.titleService.setTitle(pageTitle);
      });
  }

  private readonly authService = inject(AuthService);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly messageService = inject(MessageService);

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
