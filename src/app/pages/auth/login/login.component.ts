import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../models/user';
import { finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../services/lang.service';
import { emailValidator } from '../../../validators/emailValidator';
import { passwordValidator } from '../../../validators/passwordValidator';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  form = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      emailValidator(),
    ]),
    password: new FormControl(null, [
      Validators.required,
      // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
      passwordValidator()
    ]),
  });

  onSubmit() {
    if (this.form.valid) {
      let user: User = {
        username: '',
        nationality: '',
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        confirmPassword: '',
      };

      // on va interroger notre api via le service authService
      this.loading = true;

      this.authService
        .login(user)
        .pipe(
          finalize(() => {
            this.loading = false; // ← toujours exécuté
          })
        )
        .subscribe({
          next: (res) => {
            // Succès
            this.router.navigate(['/dashboard/my-learning-space']);
          },
          error: (err) => {
            // Erreur
            this.messageService.setMessage({
              text: err.error.message,
              type: 'error',
            });
          },
        });
    } else {
      // form invalide
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
}
