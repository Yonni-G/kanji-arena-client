import { Injectable } from '@angular/core';
import { LangService } from './lang.service';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class BaseApiService {
  constructor(protected readonly langService: LangService) {}

  protected get apiUrl(): string {
    return `${environment.apiUrl}/api/${this.langService.getLang()}`;
  }
}
