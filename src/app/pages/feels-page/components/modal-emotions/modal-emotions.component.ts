import {Component, OnDestroy, OnInit} from '@angular/core';
import {Emotions} from '../../../../interfaces/emotions';
import {Subscription} from 'rxjs';
import {EmotionModalServiceService} from '../../../../../services/emotion-modal-service.service';

@Component({
  selector: 'app-modal-emotions',
  imports: [],
  templateUrl: './modal-emotions.component.html',
  styleUrl: './modal-emotions.component.css'
})
export class ModalEmotionsComponent implements OnInit, OnDestroy {
  isOpen = false;
  mood: Emotions | null = null;
  private subscription: Subscription | undefined;

  constructor(private modalService: EmotionModalServiceService) {
  }

  ngOnInit() {
    this.subscription = this.modalService.modalState$.subscribe((data: { isOpen: boolean, mood: Emotions | null }) => {
      this.isOpen = data.isOpen;
      this.mood = data.mood;

      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  closeModal(event: MouseEvent) {
    if (
      event.target === event.currentTarget || (event.target as HTMLElement).closest('.modal-close-button')
    ) {
      this.modalService.closeModal();
      event.stopPropagation();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    document.body.style.overflow = '';
  }
}
