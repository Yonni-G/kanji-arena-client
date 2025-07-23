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
import { filter, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from './services/lang.service';
import { SeoService } from './services/SeoService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // corrigé pour `styleUrls`
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly messageService = inject(MessageService);

  constructor(
    private activatedRoute: ActivatedRoute,
    private langService: LangService,
    private translate: TranslateService,
    private seoService: SeoService
  ) {
    const lang = this.langService.getLang();
    this.translate.addLangs(['en', 'fr', 'ja']);
    this.translate.use(lang);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;

        const data = route.snapshot.data;

        // Récupération des clés i18n pour titre, description, keywords
        const titleKey: string | undefined = data['title'];
        const descKey: string | undefined = data['descriptionKey'];
        const keywordsKey: string | undefined = data['keywordsKey'];

        // Valeur par défaut des metas si absence de clés
        const defaultTitle = 'Kanji Quiz | Kanji Arena';
        const defaultDescription =
          'Kanji-Arena : plateforme de jeux et quiz en ligne pour progresser en japonais et défier la communauté sur les kanji.';
        const defaultKeywords =
          'kanji, japonais, quiz, jeu, classement, apprentissage, langue, Japon, kanji-arena';
        const defaultImage =
          'https://kanji-arena.com/assets/images/og-image.png'; // image OG
        const baseUrl = 'https://kanji-arena.com';

        if (titleKey) {
          // Traduction parallèle avec forkJoin pour optimiser les appels
          forkJoin({
            title: this.translate.get(titleKey),
            description: descKey
              ? this.translate.get(descKey)
              : Promise.resolve(defaultDescription),
            keywords: keywordsKey
              ? this.translate.get(keywordsKey)
              : Promise.resolve(defaultKeywords),
          }).subscribe(
            ({ title, description, keywords }) => {
              const fullTitle = `${title} | Kanji Quiz | Kanji Arena`;
              const url = baseUrl + this.router.url;

              this.seoService.updateHeadTags(
                fullTitle,
                description,
                keywords,
                url,
                defaultImage
              );
            },
            (error) => {
              console.error('Erreur traduction SEO:', error);
              // fallback simple
              this.seoService.updateHeadTags(
                defaultTitle,
                defaultDescription,
                defaultKeywords,
                baseUrl,
                defaultImage
              );
            }
          );
        } else {
          // Pas de clé titre => fallback
          this.seoService.updateHeadTags(
            defaultTitle,
            defaultDescription,
            defaultKeywords,
            baseUrl,
            defaultImage
          );
        }
      });
  }

  ngOnInit(): void {
    const token = this.authService.getAccessTokenFromStorage();

    if (token) {
      // Vérification expiration token
      const isExpired = this.jwtHelper.isTokenExpired(token);

      if (isExpired) {
        this.messageService.setMessage({
          text: "For security reasons, it's time to reconnect :)",
          type: 'info',
        });
        this.authService.logout();
        this.router.navigate(['/login']);
        return;
      }

      // Initialisation nom utilisateur
      const username = this.authService.getUsernameFromToken();

      if (!username) {
        this.authService.logout();
        return;
      }

      this.authService.setUsername$(username);
    }
  }
}
