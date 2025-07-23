import { inject, Injectable } from '@angular/core';
import { ApiMyLearningSpaceService } from './api.my-learning-service.';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyLearningSpaceService {
  constructor() {}

  private readonly apiMyLearningSpaceService: ApiMyLearningSpaceService =
    inject(ApiMyLearningSpaceService);

  getMyLearningSpace(): Observable<any> {
    return this.apiMyLearningSpaceService.getMyLearningSpace();
  }
}
