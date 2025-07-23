import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
  const PASSWORD_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>?/~]).{8,}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!PASSWORD_PATTERN.test(value)) {
      return { weakPassword: true };
    }
    return null;
  };
}
