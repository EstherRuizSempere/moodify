import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Emotions} from '../../../../../interfaces/emotions';

@Component({
  selector: 'app-mood-modal',
  imports: [
    NgClass, CommonModule, FormsModule
  ],
  templateUrl: './mood-modal.component.html',
  styleUrl: './mood-modal.component.css'
})
export class MoodModalComponent implements OnChanges {
  @Input() show: boolean = false;
  @Input() selectedDate: Date | null = null;
  @Input() availableMoods: Emotions[] = [];
  @Input() initialMood: Emotions | null = null;
  @Input() initialNote: string = '';

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveMood = new EventEmitter<{ moodId: number, note: string }>();

  selectedMood: Emotions | null = null;
  dayNote: string = "";

  ngOnChanges(changes: SimpleChanges) {
    //Cuando cambie los inputs, se actualiza el estado interno
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
    if (!this.selectedMood) return;

    //Sino
    this.saveMood.emit({
      moodId: this.selectedMood.id,
      note: this.dayNote
    });
  }

  selectMood(mood: Emotions): void {
    this.selectedMood = mood;
  }
}
