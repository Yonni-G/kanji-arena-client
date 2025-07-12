import { AbstractControl, ValidationErrors } from '@angular/forms';
import type { Country } from '@wlucha/ng-country-select';

function isCountry(value: any): value is Country {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.alpha2 === 'string'
  );
}

export function countryObjectValidator(
  control: AbstractControl
): ValidationErrors | null {console.log(control)
  const value = control.value;
  if (!isCountry(value)) {
    return { invalidCountry: true };
  }
  return null;
}
