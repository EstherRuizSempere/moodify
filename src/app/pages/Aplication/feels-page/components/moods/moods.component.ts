import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {Emotions} from '../../../../../interfaces/emotions';
import {EmotionModalServiceService} from '../../../../../../services/emotion-modal-service.service';

@Component({
  selector: 'app-moods',
  imports: [
    NgClass
  ],
  templateUrl: './moods.component.html',
  styleUrl: './moods.component.css'
})
export class MoodsComponent {
  // input para recibir la emoción desde el componente padre
  @Input() mood!: Emotions;
  isHovered = false;

  // inyeccion del servicio para abrir el modal
  constructor(private modalService: EmotionModalServiceService) {
  }

  // metodo para abrir el modal cuando hago click
  openEmotionModal() {
    this.modalService.openModal(this.mood);
  }
}
