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

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  form = new FormGroup({
    email: new FormControl('Yonni4@gmail.com', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
    ]),
    password: new FormControl('Popo45!!', [
      Validators.required,
      // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~]).{8,}$'
      ),
    ]),
  });

  onSubmit() {
    if (this.form.valid) {
      let user: User = {
        username: '',
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
            this.router.navigate(['/']);
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
