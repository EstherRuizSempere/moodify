import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {Emotions} from '../../../../interfaces/emotions';
import {EmotionModalServiceService} from '../../../../../services/emotion-modal-service.service';

@Component({
  selector: 'app-moods',
  imports: [
    NgClass
  ],
  templateUrl: './moods.component.html',
  styleUrl: './moods.component.css'
})
export class MoodsComponent {
  @Input() mood!: Emotions;
  isHovered = false;

  constructor(private modalService: EmotionModalServiceService) {
  }

  openEmotionModal() {
    this.modalService.openModal(this.mood);
  }
}
