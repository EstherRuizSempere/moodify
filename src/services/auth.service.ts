import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  public register(name: string, email: string, password: string) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
      .set('name', name)
      .set('email', email)
      .set('password', password);

    return this.http.post('http://moodify.test/back/endpoints/users/register.php', body, {headers});
  }

  public login(email: string, password: string) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post<any>('http://moodify.test/back/endpoints/users/login.php', body, {headers})
      .pipe(
        tap(response => {
          if (response.status === 'success') {  // ✅ esta es la propiedad que tú mandas desde PHP
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user_id', response.data.id.toString());
          } else {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user_id');
          }
        })
      );
  }


  public getUserId(): number {
    return parseInt(localStorage.getItem('user_id') || '0');
  }

  public logout() {
    //limpiando  localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('user_id');
    localStorage.removeItem('isLoggedIn')

    this.http.post<any>('http://moodify.test/back/endpoints/users/logout.php', {}).pipe(take(1)).subscribe({
      next: (response) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
