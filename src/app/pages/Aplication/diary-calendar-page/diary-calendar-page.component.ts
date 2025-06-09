import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Emotions } from '../../../interfaces/emotions';
import { MoodsDataService } from '../../../../services/moods-data.service';
import { MoodModalComponent } from './components/mood-modal/mood-modal.component';
import { SaveEmotionService } from '../../../../services/save-emotion.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-diary-calendar-page',
  imports: [
    NgClass,
    MoodModalComponent
  ],
  templateUrl: './diary-calendar-page.component.html',
  styleUrl: './diary-calendar-page.component.css'
})
export class DiaryCalendarPageComponent implements OnInit {

  // Propiedades para el calendario
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();

  weekdays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  currentMonthName: string = this.monthNames[this.currentMonth];
  previousMonthDays: number[] = [];
  currentMonthdays: number[] = [];
  nextMonthDays: number[] = [];

  // Propiedades para la modal
  showModal: boolean = false;
  selectedDate: Date | null = null;
  selectedMood: Emotions | null = null;
  dayNote: string = '';

  // Estados de ánimo cargados desde el servicio
  availableMoods: Emotions[] = [];

  // Mapa fecha → emoción (BD)
  emotionsPerDay: { [fecha: string]: string } = {};

  constructor(
    private moodService: MoodsDataService,
    private saveEmotionService: SaveEmotionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMoods();
    this.loadEmotions();
    this.generateCalendar();
  }

  // Cargar estados de ánimo desde el servicio
  loadMoods() {
    this.moodService.getData().subscribe({
      next: (moods) => {
        this.availableMoods = moods;
      },
      error: (error) => {
        console.error("Error al cargar los estados de ánimo", error);
      }
    });
  }

  // Cargar emociones desde la base de datos
  loadEmotions() {
    const user_id = this.authService.getUserId();

    this.saveEmotionService.listEmotions(user_id).subscribe({
      next: (res: any) => {
        console.log('Emociones recibidas:', res);
        if (res.status === 'success') {
          this.emotionsPerDay = {};

          res.data.forEach((emotionEntry: any) => {
            this.emotionsPerDay[emotionEntry.fecha] = emotionEntry.emotion;
          });

          console.log('Mapa emotionsPerDay:', this.emotionsPerDay);
        }
      },
      error: (err) => {
        console.error('Error al listar emociones:', err);
      }
    });
  }

  // Generar calendario
  generateCalendar(): void {
    this.previousMonthDays = [];
    this.currentMonthdays = [];
    this.nextMonthDays = [];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6;

    // Días del mes anterior
    if (firstDayOfWeek > 0) {
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        this.previousMonthDays.push(prevMonthLastDay - i);
      }
    }

    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.currentMonthdays.push(i);
    }

    // Días del mes siguiente
    const totalDaysShown = this.previousMonthDays.length + this.currentMonthdays.length;
    const nextMonthDays = 42 - totalDaysShown;

    for (let i = 1; i <= nextMonthDays; i++) {
      this.nextMonthDays.push(i);
    }

    this.currentMonthName = this.monthNames[this.currentMonth];
  }

  // Navegar al mes anterior
  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
    this.loadEmotions(); // importante para actualizar el mes que ves
  }

  // Navegar al mes siguiente
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.loadEmotions(); // importante para actualizar el mes que ves
  }

  // Verificar si hay una emoción registrada en el día
  hasMoodForDay(day: number): boolean {
    const dateKey = this.getDateKey(day);
    return !!this.emotionsPerDay[dateKey];
  }

  // Obtener la info del estado de ánimo para un día específico
  getMoodInfo(day: number): { image?: string, alt?: string } {
    const dateKey = this.getDateKey(day);
    const emotionName = this.emotionsPerDay[dateKey];
    const mood = this.availableMoods.find(mood => mood.name === emotionName);

    if (mood) {
      return {
        image: mood.image,
        alt: mood.alt
      };
    }

    return {};
  }

  // Obtener la clave de la fecha en formato 'YYYY-MM-DD'
  getDateKey(day: number): string {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return date.toISOString().split('T')[0];
  }

  // Abrir modal
  openMoodModal(day: number): void {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.resetModalForm();
    this.showModal = true;
  }

  // Resetear modal
  resetModalForm(): void {
    this.selectedMood = null;
    this.dayNote = '';
  }

  // Cuando el modal guarda una emoción → volver a cargar las emociones
  onMoodSaved(data: { moodId: number, note: string }): void {
    this.loadEmotions(); // Recargamos las emociones desde la BD
    this.closeModal();
  }

  // Cerrar modal
  closeModal(): void {
    this.showModal = false;
  }
}
