import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root',
})
export class ApiCommonService extends BaseApiService {
    private readonly http: HttpClient;
    constructor(http: HttpClient, langService: LangService) {
      super(langService);
      this.http = http;
    }

  // Envoi d'un message de contact
  sendContactMessage(message: {
    name: string;
    email: string;
    message: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contact/send`, message);
  }
}
