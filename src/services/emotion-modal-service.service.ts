import {Injectable} from '@angular/core';

//servicio implementado para utilizar Rxjs donde comunico el estado
import {BehaviorSubject} from 'rxjs';
import {Emotions} from '../app/interfaces/emotions';

@Injectable({
  providedIn: 'root'
})
export class EmotionModalServiceService {

  // BehaviorSubject para manejar el estado del modal
  private modalStateSubject = new BehaviorSubject<{ isOpen: boolean, mood: Emotions | null }>({
    isOpen: false,
    mood: null
  });

  // Observable para que otros componentes puedan suscribirse a los cambios
  modalState$ = this.modalStateSubject.asObservable();

  // Métod para abrir el modal y establecer el estado de la emoción específica
  openModal(mood: Emotions) {
    this.modalStateSubject.next({
      isOpen: true,
      mood: mood
    })
  }

  // Metod para cerrar el modal
  closeModal() {
    this.modalStateSubject.next({
      isOpen: false,
      mood: null
    })
  }

  constructor() {
  }
}
