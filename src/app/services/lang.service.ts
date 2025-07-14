import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LangService {
  private lang: 'fr' | 'en' | 'ja' = 'en';

  // Observable pour la langue courante
  private langSubject = new BehaviorSubject<'fr' | 'en' | 'ja'>(this.lang);
  lang$ = this.langSubject.asObservable();

  constructor() {
    const storedLang = localStorage.getItem('lang');
    if (storedLang === 'fr' || storedLang === 'en' || storedLang === 'ja') {
      this.lang = storedLang;
    } else {
      // Détection automatique selon le navigateur
      const browserLang = navigator.language?.slice(0, 2);
      if (
        browserLang === 'fr' ||
        browserLang === 'en' ||
        browserLang === 'ja'
      ) {
        this.lang = browserLang;
      } else {
        this.lang = 'en'; // Langue par défaut
      }
      // Écrit la langue détectée dans le localStorage
      localStorage.setItem('lang', this.lang);
    }
    // Initialise le BehaviorSubject avec la langue détectée
    this.langSubject.next(this.lang);
  }

  setLang(lang: 'fr' | 'en' | 'ja') {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    this.langSubject.next(lang); // Notifie tous les abonnés du changement
  }

  getLang(): 'fr' | 'en' | 'ja' {
    return this.lang;
  }
}
