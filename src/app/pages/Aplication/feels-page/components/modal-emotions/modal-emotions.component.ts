import {Component, OnDestroy, OnInit} from '@angular/core';
import {Emotions} from '../../../../../interfaces/emotions';
import {Subscription} from 'rxjs';
import {EmotionModalServiceService} from '../../../../../../services/emotion-modal-service.service';

@Component({
  selector: 'app-modal-emotions',
  imports: [],
  templateUrl: './modal-emotions.component.html',
  styleUrl: './modal-emotions.component.css'
})
export class ModalEmotionsComponent implements OnInit, OnDestroy {
  // Por defecto está cerrado
  isOpen = false;
  // Estado de la emoción que se pasa al modal que puede ser null
  mood: Emotions | null = null;
  // Subscription para manejar el estado del modal
  private subscription: Subscription | undefined;

  // inyección del servicio para abrir y cerrar el modal
  constructor(private modalService: EmotionModalServiceService) {
  }

  // Se suscribe al observable del servicio para recibir el estado del modal (es decir, así detecto los cambios)
  ngOnInit() {
    // Se suscribe al observable del servicio para recibir el estado del modal
    this.subscription = this.modalService.modalState$.subscribe((data: { isOpen: boolean, mood: Emotions | null }) => {
      this.isOpen = data.isOpen;
      this.mood = data.mood;

      // Cambia el overflow del body según el estado del modal, bloqueo su desplazamiento cuando esté abierta
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // metod para cerrar la modal con el evento click
  closeModal(event: MouseEvent) {
    if (
      event.target === event.currentTarget || (event.target as HTMLElement).closest('.modal-close-button')
    ) {
      this.modalService.closeModal();
      event.stopPropagation();
    }
  }

  //limpiar la subscription al destruir el componente
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    document.body.style.overflow = '';
  }
}
