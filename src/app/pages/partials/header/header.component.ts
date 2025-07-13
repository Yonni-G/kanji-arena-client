import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { LangService } from '../../../services/lang.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string | null = null;
  isAuthenticated: boolean = false;
  currentLang: 'en' | 'ja' | 'fr' = 'fr';
  private langSub?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly langService: LangService,
    private translate: TranslateService
  ) {
    this.authService.getUsername$().subscribe((username) => {
      this.username = username;
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  ngOnInit(): void {
    // Souscrit à la langue pour la garder à jour automatiquement
    this.langSub = this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  setLang(lang: 'fr' | 'en' | 'ja') {
    this.langService.setLang(lang);
    // Pas besoin de set currentLang ici, c'est réactif via le service
    this.translate.use(lang);
  }

  get flagClass(): string {
    if (this.currentLang === 'fr') return 'fi fi-fr';
    if (this.currentLang === 'en') return 'fi fi-gb';
    if (this.currentLang === 'ja') return 'fi fi-jp';
    return '';
  }

  // Utilise ngx-translate pour le label de langue (plus évolutif)
  get langLabel(): string {
    switch (this.currentLang) {
      case 'fr':
        return this.translate.instant('HEADER.LANG_FR');
      case 'en':
        return this.translate.instant('HEADER.LANG_EN');
      case 'ja':
        return this.translate.instant('HEADER.LANG_JA');
      default:
        return 'Langue';
    }
  }

  logout() {
    this.authService.logout();
  }
}
