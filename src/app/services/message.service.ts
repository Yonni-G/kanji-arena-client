import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Message } from "../models/message";

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly messageSource = new BehaviorSubject<{
    message: Message | null;
    clearAfter: number;
  }>({
    message: null,
    clearAfter: 3000, // Délai par défaut
  });
  currentMessage = this.messageSource.asObservable();

  setMessage(message: Message, clearAfter: number = 3000) {
    this.messageSource.next({ message, clearAfter }); // Emit un objet avec le message et le délai
  }

  clearMessage() {
    this.messageSource.next({ message: null, clearAfter: 3000 });
  }
}
