import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCommonService } from './api.common.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private readonly apiService: ApiCommonService = inject(ApiCommonService);

  sendContactMessage(message: {
    name: string;
    email: string;
    message: string;
  }): Observable<any> {
    return this.apiService.sendContactMessage(message);
  }
}
