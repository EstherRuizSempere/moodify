import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Emotions} from '../../../../../interfaces/emotions';
import {SaveEmotionService} from '../../../../../../services/save-emotion.service';
import {AuthService} from '../../../../../../services/auth.service';

@Component({
  selector: 'app-mood-modal',
  imports: [
    NgClass, CommonModule, FormsModule
  ],
  templateUrl: './mood-modal.component.html',
  styleUrl: './mood-modal.component.css'
})
export class MoodModalComponent implements OnChanges, OnInit {
  @Input() show: boolean = false;
  @Input() selectedDate: Date | null = null;
  @Input() availableMoods: Emotions[] = [];
  @Input() initialMood: Emotions | null = null;
  @Input() initialNote: string = '';

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveMood = new EventEmitter<{ moodId: number, note: string }>();

  selectedMood: Emotions | null = null;
  dayNote: string = "";

  constructor(
    private saveEmotionService: SaveEmotionService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.selectedMood = this.initialMood;
    this.dayNote = this.initialNote;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialMood'] || changes['initialNote']) {
      this.selectedMood = this.initialMood;
      this.dayNote = this.initialNote;
    }
  }

  onClose(event: Event): void {
    event.preventDefault();
    this.closeModal.emit();
  }

  onSave(): void {
    if (!this.selectedDate) {
      console.error('No hay fecha seleccionada, no se puede guardar la emoción.');
      return;
    }

    if (!this.selectedMood) {
      console.error('No hay estado de ánimo seleccionado.');
      return;
    }

    const user_id = this.authService.getUserId();
    const fecha = this.selectedDate.toISOString().split('T')[0];

    this.saveEmotionService.saveEmotion(
      user_id,
      fecha,
      this.selectedMood.name, // emotion
      this.dayNote
    ).subscribe({
      next: (res: any) => {
        console.log('Emoción guardada:', res);

        // Emitir saveMood para que el calendario pueda actualizarse (opcional)
        this.saveMood.emit({
          moodId: this.selectedMood!.id,
          note: this.dayNote
        });

        this.closeModal.emit();
      },
      error: (err) => {
        console.error('Error al guardar emoción:', err);
      }
    });
  }

  selectMood(mood: Emotions): void {
    this.selectedMood = mood;
  }
}
