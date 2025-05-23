import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  message: Message | null = null;
  private clearAfter: number = 3000; // Valeur par défaut

  constructor(private readonly messageService: MessageService) {}

 ngOnInit() {
    // S'abonner aux messages et au délai 'clearAfter'
    this.messageService.currentMessage.subscribe(({ message, clearAfter }) => {
      this.message = message || null; // Récupérer le texte du message
      this.clearAfter = clearAfter; // Récupérer le délai

      // Si un message est défini, démarrer un délai pour le supprimer
      if (message) {
        setTimeout(() => {
          this.message = null;
        }, this.clearAfter); // Utiliser le délai 'clearAfter' pour faire disparaître le message
      }
    });
}
}
