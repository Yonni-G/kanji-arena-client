
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

export function provideJwtHelper() {
  return [{ provide: JWT_OPTIONS, useValue: {} }, JwtHelperService];
}
