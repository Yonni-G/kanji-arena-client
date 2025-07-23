import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  // Doit être une adresse e-mail valide
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!EMAIL_PATTERN.test(value)) {
      return { invalidEmail: true };
    }
    return null;
  };
}
