import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-giphy-api',
  imports: [
    NgIf
  ],
  templateUrl: './giphy-api.component.html',
  styleUrl: './giphy-api.component.css',
  standalone: true
})
export class GiphyApiComponent {
  gifUrl: string | null = null;
  loading = false;

  constructor(private http: HttpClient) {}

  getGif(): void {
    this.loading = true;
    this.http.get<any>('https://api.giphy.com/v1/gifs/random?api_key=2tiAh1pkEP6TXvtS5H59KwIHqAcAUXyt')
      .subscribe({
        next: (data) => {
          this.gifUrl = data.data.images.original.url;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}
