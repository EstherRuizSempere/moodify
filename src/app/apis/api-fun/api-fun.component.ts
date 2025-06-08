import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-api-fun',
  imports: [
    NgIf
  ],
  templateUrl: './api-fun.component.html',
  styleUrl: './api-fun.component.css',
  standalone: true
})
export class ApiFunComponent implements OnInit {
  adviceText: string = '';
  loading: boolean = false;
  animateAdvice = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAdvice();
  }

  getAdvice(): void {
    this.loading = true;
    this.http.get<any>('https://api.adviceslip.com/advice')
      .subscribe({
        next: (data) => {
          this.loading = false;

          this.animateAdvice = false; // reset
          setTimeout(() => {
            this.adviceText = data.slip.advice;
            this.animateAdvice = true;
          }, 50);
        },
        error: () => {
          this.loading = false;
          this.adviceText = 'Error al obtener consejo 😭';
        }
      });
  }
}
