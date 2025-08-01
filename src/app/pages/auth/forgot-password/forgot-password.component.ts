import { Component, inject } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { finalize } from 'rxjs';
import { LangService } from '../../../services/lang.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { emailValidator } from '../../../validators/emailValidator';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  form = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      emailValidator(),
    ]),
  });

  onSubmit() {
    if (this.form.valid) {
      //console.log(this.form.value);

      let user: User = {
        username: '',
        nationality: '',
        email: this.form.value.email || '',
        password: '',
        confirmPassword: '',
      };

      this.loading = true;
      // on va interroger notre api via le service authService
      this.authService
        .forgotPassword(user)
        .pipe(
          finalize(() => {
            this.loading = false; // ← toujours exécuté
          })
        )
        .subscribe({
          next: (response) => {
            this.form.reset();
            this.messageService.setMessage(
              { text: response.message, type: 'success' },
              5000
            );
          },
          error: (error) => {
            console.error('Password reset failed', error);
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
