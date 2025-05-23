import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { User } from '../../../models/user';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  resetToken: string = this.route.snapshot.params['resettoken'];
  loading = false;

  // Formulaire de réinitialisation de mot de passe
  form = new FormGroup(
    {
      password: new FormControl(null, [
        Validators.required,
        // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~]).{8,}$'
        ),
      ]),
      confirmPassword: new FormControl(null, [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  );

  ngOnInit(): void {
    // Vérification de la présence du token
    if (!this.resetToken) {
      this.messageService.setMessage({
        text: 'Token de réinitialisation manquant.',
        type: 'error',
      });
      return;
      //this.router.navigate(['/login']);
    }
    // Vérification de la validité du resetToken
    this.authService.checkResetToken(this.resetToken).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Erreur lors de la vérification du token', error);
        this.messageService.setMessage({
          text: error.error.message,
          type: 'error',
        });
        this.router.navigate(['/forgot-password']);
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      let user: User = {
        username: '',
        email: '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || '',
      };
      this.loading = true;
      this.authService
        .resetPassword(this.resetToken, user.password, user.confirmPassword)
        .pipe(
          finalize(() => {
            this.loading = false; // ← toujours exécuté
          })
        )
        .subscribe({
          next: (response) => {
            this.messageService.setMessage(
              {
                text: response.message,
                type: 'success',
              },
              5000
            );
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Réinitialisation échouée', error);
            this.messageService.setMessage({
              text: error.message,
              type: 'error',
            });
          },
        });
    }
  }
}
