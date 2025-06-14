import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(private http: HttpClient) { }
  public deleteUser(userId: number): Observable<any> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams().set('user_id', userId.toString());

    return this.http.post<any>(environment.moodifyApiUrl + 'users/delete_user.php', body, { headers });
  }
}
