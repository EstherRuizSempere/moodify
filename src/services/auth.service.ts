import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

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

    return this.http.post('http://moodify.test/back/endpoints/users/login.php', body, {headers});
  }
}
