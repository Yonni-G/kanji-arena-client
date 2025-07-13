import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './pages/partials/header/header.component';
import { FooterComponent } from './pages/partials/footer/footer.component';
import { MessageComponent } from './pages/partials/message/message.component';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from './services/message.service';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from './services/lang.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly messageService = inject(MessageService);

  constructor(
    private readonly titleService: Title,
    private readonly activatedRoute: ActivatedRoute,
    private readonly langService: LangService,
    private readonly translate: TranslateService // Ajout pour la traduction dynamique
  ) {
    // on charge les traductions
    const lang = this.langService.getLang();
    this.translate.addLangs(['en', 'fr', 'ja']);
    this.translate.use(lang);

    // Met à jour le titre à chaque navigation, en le traduisant dynamiquement
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        const titleKey = route.snapshot.data['title'];
        if (titleKey) {
          this.translate.get(titleKey).subscribe((translatedTitle: string) => {
            this.titleService.setTitle(`${translatedTitle} | Kanji Arena`);
          });
        } else {
          this.titleService.setTitle('Kanji Arena');
        }
      });
  }

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
