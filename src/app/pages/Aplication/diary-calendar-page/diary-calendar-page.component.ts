import {Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {Emotions} from '../../../interfaces/emotions';
import {MoodsDataService} from '../../../../services/moods-data.service';
import {MoodModalComponent} from './components/mood-modal/mood-modal.component';

interface MoodEntry {
  date: Date;
  moodId: number;
  note?: string;
}

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

  //Propiedades para el calendario
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();

  //Preguntar a alexis, ¿es viable que esto sea una interfaz?
  weekdays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  currentMonthName: string = this.monthNames[this.currentMonth];
  previousMonthDays: number[] = [];
  currentMonthdays: number[] = [];
  nextMonthDays: number[] = [];

  //Propiuedades para la modal y la entrada del estado de ánimo
  showModal: boolean = false;
  selectedDate: Date | null = null;
  selectedMood: Emotions | null = null;
  dayNote: string = '';
  moodEntries: MoodEntry[] = [];

  // Estados de ánimo cargados desde el servicio
  availableMoods: Emotions[] = [];

  constructor(private moodService: MoodsDataService) {
  }

  ngOnInit() {
    this.loadMoods();
    this.loadMoodEntries();
    this.generateCalendar();
  }

  //Cargo los estados de ánimo desde el servicio
  loadMoods() {
    this.moodService.getData().subscribe({
      next: (moods) => {
        this.availableMoods = moods;
      },
      error: (error) => {
        console.error("Error al cargar los estados de ánimo", error)
      }
    });
  }

  //Carga de entradas de estados de ánimo (pr ahora con local)
  loadMoodEntries(): void {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      //transformar las fechas que son string a objeto date
      const parseado = JSON.parse(savedEntries);
      this.moodEntries = parseado.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    }
  }

  //Guardar la entrada de estado de ánimo
  savedMoodEntries(): void {
    localStorage.setItem('moodEntries', JSON.stringify(this.moodEntries));
  }

  //Generar calendario para el mes
  generateCalendar(): void {
    this.previousMonthDays = [];
    this.currentMonthdays = [];
    this.nextMonthDays = [];

    //obtener el primer día del mes actual
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    //   obtener el último día de l mes actual
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6; // Si es domingo (0), ajustar a 6

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
    const nextMonthDays = 42 - totalDaysShown; // 6 semanas * 7 días = 42

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
  }

  //Verificar si hay un mood registrado en el día específico
  hasMoodForDay(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.moodEntries.some(entry =>
      entry.date.getDate() === date.getDate() &&
      entry.date.getMonth() === date.getMonth() &&
      entry.date.getFullYear() === date.getFullYear()
    );
  }

// Obtener el icono/imagen del estado de ánimo para un día específico
  getMoodInfo(day: number): { image?: string, alt?: string } {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const entry = this.moodEntries.find(entry =>
      entry.date.getDate() === date.getDate() &&
      entry.date.getMonth() === date.getMonth() &&
      entry.date.getFullYear() === date.getFullYear()
    );

    if (entry && this.availableMoods.length > 0) {
      const mood = this.availableMoods.find(mood => mood.id === entry.moodId);
      if (mood) {
        return {
          image: mood.image,
          alt: mood.alt
        };
      }
    }

    return {};
  }

  // Abrir el modal para seleccionar estado de ánimo
  openMoodModal(day: number): void {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.resetModalForm();

    // Verificar si ya existe una entrada para este día
    const existingEntry = this.moodEntries.find(entry =>
      entry.date.getDate() === this.selectedDate!.getDate() &&
      entry.date.getMonth() === this.selectedDate!.getMonth() &&
      entry.date.getFullYear() === this.selectedDate!.getFullYear()
    );

    if (existingEntry) {
      this.selectedMood = this.availableMoods.find(mood => mood.id === existingEntry.moodId) || null;
      this.dayNote = existingEntry.note || '';
    }

    this.showModal = true;
  }

  // Resetear el formulario del modal
  resetModalForm(): void {
    this.selectedMood = null;
    this.dayNote = '';
  }

  // Métod que será llamado desde el componente modal
  onMoodSaved(data: { moodId: number, note: string }): void {
    if (!this.selectedDate) return;

    // Comprobar si ya existe una entrada para este día
    const existingEntryIndex = this.moodEntries.findIndex(entry =>
      entry.date.getDate() === this.selectedDate!.getDate() &&
      entry.date.getMonth() === this.selectedDate!.getMonth() &&
      entry.date.getFullYear() === this.selectedDate!.getFullYear()
    );

    const newEntry: MoodEntry = {
      date: this.selectedDate,
      moodId: data.moodId,
      note: data.note.trim() || undefined
    };

    if (existingEntryIndex !== -1) {
      // Actualizar entrada existente
      this.moodEntries[existingEntryIndex] = newEntry;
    } else {
      // Crear nueva entrada
      this.moodEntries.push(newEntry);
    }

    // Guardar en localStorage
    this.savedMoodEntries();

    // Cerrar el modal
    this.closeModal();
  }

  // Cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }
}
