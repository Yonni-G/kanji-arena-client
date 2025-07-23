import { Component } from '@angular/core';
import { MyLearningSpaceService } from '../../../services/my-learning-space.service';
import { MessageService } from '../../../services/message.service';
import { DatePipe, NgClass } from '@angular/common';
import { ProgressionData } from '../../../interfaces/LearningSpaceData';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-learning-space',
  imports: [NgClass, DatePipe, TranslateModule],
  templateUrl: './my-learning-space.component.html',
  styleUrl: './my-learning-space.component.css',
})
export class MyLearningSpaceComponent {
  ProgressionData: ProgressionData = { items: [] };
  loading = true;

  constructor(
    private readonly myLearningSpaceService: MyLearningSpaceService,
    private readonly messageService: MessageService
  ) {
    this.myLearningSpaceService.getMyLearningSpace().subscribe({
      next: (response) => {
        this.ProgressionData = response;
        this.loading = false;
        // console.log pour debug
        //console.log("Données de l'espace d'apprentissage:", response);
      },
      error: (err) => {
        this.ProgressionData = { items: [] };
        this.loading = false;
        console.error(
          "Erreur lors de la récupération des données de l'espace d'apprentissage",
          err
        );
        this.messageService.setMessage({
          text: err.error?.message || 'Une erreur est survenue',
          type: 'error',
        });
      },
    });
  }
}
