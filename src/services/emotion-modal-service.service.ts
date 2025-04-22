import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Emotions} from '../app/interfaces/emotions';

@Injectable({
  providedIn: 'root'
})
export class EmotionModalServiceService {

  private modalStateSubject = new BehaviorSubject<{ isOpen: boolean, mood: Emotions | null }>({
    isOpen: false,
    mood: null
  });

  modalState$ = this.modalStateSubject.asObservable();

  openModal(mood: Emotions) {
    this.modalStateSubject.next({
      isOpen: true,
      mood: mood
    })
  }

  closeModal() {
    this.modalStateSubject.next({
      isOpen: false,
      mood: null
    })
  }

  constructor() {
  }
}
