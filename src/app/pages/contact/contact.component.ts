import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { MessageService } from '../../services/message.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'], // si tu as des styles spécifiques
  imports: [ReactiveFormsModule, TranslateModule], // si tu utilises des modules Angular spécifiques, ajoute-les ici
})
export class ContactComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly commonService: CommonService,
    private readonly messageService: MessageService
  ) {}

  form!: FormGroup;
  loading = false;

  ngOnInit(): void {

    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const contactMessage = {
      name: this.form.value.name,
      email: this.form.value.email,
      message: this.form.value.message,
    };
    // Appel au service pour envoyer le message de contact
    this.commonService.sendContactMessage(contactMessage).subscribe({
      next: (response) => {
        // on utilise notre service messageService pour afficher un message de succès
        this.messageService.setMessage({
          text: response.message,
          type: 'success',
        });
        this.form.reset();
      },
      error: (error) => {
        // on utilise notre service messageService pour afficher un message d'erreur
        this.messageService.setMessage({
          text: error.message || "Erreur lors de l'envoi du message",
          type: 'error',
        });
        console.error("Erreur lors de l'envoi du message", error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
