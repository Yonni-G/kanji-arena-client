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
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  form = new FormGroup(
    {
      username: new FormControl('Yonni', [
        Validators.pattern('^[a-zA-Z0-9]{3,12}$'), // 3 à 12 caractères alphanumériques
      ]),
      email: new FormControl('yonni4@gmail.com', [
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
      confirmPassword: new FormControl('Popo45!!', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  ); // Ajout du validateur de correspondance);

  onSubmit() {
    if (this.form.valid) {
      //console.log(this.form.value);

      let user: User = {
        username: this.form.value.username || '',
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || '',
      };

      this.loading = true;
      // on va interroger notre api via le service authService
      this.authService.register(user)       .pipe(
               finalize(() => {
                 this.loading = false; // ← toujours exécuté
               })
             ).subscribe({
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
          this.messageService.setMessage({ text: error.error.message, type: 'error' });
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
