import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root',
})
export class ApiMyLearningSpaceService extends BaseApiService {
    private readonly http: HttpClient;
    constructor(http: HttpClient, langService: LangService) {
      super(langService);
      this.http = http;
    }

  // Récupère les données de l'espace d'apprentissage
  getMyLearningSpace(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/my-learning-space`);
  }
}
