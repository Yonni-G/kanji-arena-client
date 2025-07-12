import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiCommonService {
  constructor(private readonly http: HttpClient) {}

  // Envoi d'un message de contact
  sendContactMessage(message: {
    name: string;
    email: string;
    message: string;
  }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/contact/send`, message);
  }
}
