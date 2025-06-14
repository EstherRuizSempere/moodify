import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private http:HttpClient) { }

  public updateProfile(userId: number, name: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
      .set('user_id', userId.toString())
      .set('name', name)
      .set('email', email)
      .set('password', password || '');

    return this.http.post<any>(environment.moodifyApiUrl + 'users/update_profile.php', body, { headers });
  }
}
