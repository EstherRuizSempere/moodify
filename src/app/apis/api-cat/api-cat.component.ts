import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-api-cat',
  imports: [
    NgIf
  ],
  templateUrl: './api-cat.component.html',
  styleUrl: './api-cat.component.css',
  standalone: true
})
export class ApiCatComponent implements OnInit {
  catImageUrl: string | null = null;
  loading = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchRandomCat();
  }

  fetchRandomCat(): void {
    this.loading = true;
    this.http.get<any[]>('https://api.thecatapi.com/v1/images/search')
      .subscribe({
        next: (data) => {
          this.catImageUrl = data[0]?.url || null;
          this.loading = false;
        },
        error: () => {
          this.catImageUrl = null;
          this.loading = false;
        }
      });
  }

}
