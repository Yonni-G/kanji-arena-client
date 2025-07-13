import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../models/user';
import { finalize, Subscription } from 'rxjs';
import { Country, CountrySelectComponent } from '@wlucha/ng-country-select';
import { countryObjectValidator } from '../../../validators/countryObjectValidator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../services/lang.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    CountrySelectComponent,
    TranslateModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);

  lang: 'fr' | 'en' | 'ja' = 'en';
  private langSub?: Subscription;

  constructor(private langService: LangService) {
    // Souscrit à la langue pour que le select soit toujours à jour
    this.langSub = this.langService.lang$.subscribe((lang) => {
      this.lang = lang;
    });
  }

  loading = false;

  // Déclaration du contrôle
  nationalityControl = new FormControl<Country | null>(null, {
    nonNullable: true,
    validators: [Validators.required, countryObjectValidator],
  });

  form = new FormGroup(
    {
      username: new FormControl('', [
        Validators.pattern('^[a-zA-Z0-9]{3,12}$'), // 3 à 12 caractères alphanumériques
      ]),
      nationality: this.nationalityControl,
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~]).{8,}$'
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  ); // Ajout du validateur de correspondance);

  handleSelection(country: Country) {
    console.log('Selected country:', country);
    this.form.patchValue({
      //nationality: country,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      //console.log(this.form.value.nationality);

      let user: User = {
        username: this.form.value.username || '',
        nationality: this.form.value.nationality?.alpha2 || '',
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || '',
      };

      this.loading = true;
      // on va interroger notre api via le service authService
      this.authService
        .register(user)
        .pipe(
          finalize(() => {
            this.loading = false; // ← toujours exécuté
          })
        )
        .subscribe({
          next: (response) => {
            //console.log('Registration successful', response);
            this.messageService.setMessage(
              { text: response.message, type: 'success' },
              5000
            );
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Registration failed', error);
            this.messageService.setMessage({
              text: error.error.message,
              type: 'error',
            });
          },
        });
    } else {
      //console.log('Form is invalid');
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
}
