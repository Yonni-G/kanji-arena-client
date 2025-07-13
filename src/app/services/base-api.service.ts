import { Injectable } from '@angular/core';
import { LangService } from './lang.service';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class BaseApiService {
  constructor(protected readonly langService: LangService) {}

  protected get apiUrl(): string {
    // Utilise la langue d’API (jamais "ja" tant que le backend ne le gère pas)
    return `${environment.apiUrl}/api/${this.langService.getApiLang()}`;
  }
}
