import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import {environment} from '../environments/environment';
import {TrackPlayerService} from './track-player.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private trackPlayerService: TrackPlayerService, private router: Router) {}

  public login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post<any>(environment.moodifyApiUrl+'users/login.php', body, { headers })
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user_id', response.data.id.toString());
            this.loggedIn.next(true);
          } else {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user_id');
            this.loggedIn.next(false);
          }
        })
      );
  }

  public register(name: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
      .set('name', name)
      .set('email', email)
      .set('password', password);

    return this.http.post<any>(environment.moodifyApiUrl+'users/register.php', body, { headers });
  }

  public logout(): void {
    // Detener la música
    this.trackPlayerService.stop();

    // Limpiar storage
    localStorage.removeItem('userData');
    localStorage.removeItem('user_id');
    localStorage.removeItem('isLoggedIn');

    // Actualizar observable de login
    this.loggedIn.next(false);

    // Llamar al backend logout
    this.http.post<any>(environment.moodifyApiUrl + 'users/logout.php', {})
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log(response.message);

          if (response.status === 'success') {
            // Redirigir al login
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          console.error('Error al cerrar sesión:', error);
        }
      });
  }


  public getUserId(): number {
    return parseInt(localStorage.getItem('user_id') || '0');
  }

  public isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  public get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
