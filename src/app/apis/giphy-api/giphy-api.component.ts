import {Component} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NgIf} from '@angular/common';
import {GiphyResponse} from '../../interfaces/giphy-response';
import {catchError, of, timeout} from 'rxjs';

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
  error = false;

  private readonly apiKey = '2tiAh1pkEP6TXvtS5H59KwIHqAcAUXyt';
  private readonly apiUrl = 'https://api.giphy.com/v1/gifs/random';

  constructor(private http: HttpClient) {
  }

  getGif(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = false;
    this.gifUrl = null;

    const params = {
      api_key: this.apiKey,
      rating: 'g',
      tag: 'funny,cute,happy' // Categorías divertidas
    };

    this.http.get<GiphyResponse>(this.apiUrl, {params})
      .pipe(
        timeout(10000),
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          if (data?.data?.images?.original?.url) {
            this.gifUrl = data.data.images.original.url;
          } else {
            this.error = true;
          }
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
  }

  onImageError(): void {
    this.error = true;
    this.gifUrl = null;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error al cargar GIF:', error);
    this.error = true;
    return of(null);
  }
}


