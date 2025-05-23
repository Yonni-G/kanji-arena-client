import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiAuthService } from '../../../services/api.auth.service';
import { MessageService } from '../../../services/message.service';
@Component({
  selector: 'app-profile',
  imports: [MatSlideToggleModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private readonly messageService: MessageService = inject(MessageService);
  isActive = false;

  constructor(private readonly apiAuthService: ApiAuthService) {}

  onToggle(event: any) {
    const newValue = event.checked;

    this.apiAuthService.setAlertOutOfRanking(newValue).subscribe({
      next: (response) => {
        this.messageService.setMessage({
          text: response.message,
          type: 'success',
        });
        this.isActive = newValue;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
        this.messageService.setMessage({
          text: err.error.message,
          type: 'error',
        });
      },
    });
  }

  ngOnInit() {
    // on va interroger notre API pour obtenir le alertOutOfRanking de notre user
    //this.apiAuthService.
  }
}
