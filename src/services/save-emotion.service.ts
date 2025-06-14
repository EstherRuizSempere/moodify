import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaveEmotionService {

  constructor(private http: HttpClient) {}

  public saveEmotion(user_id: number, fecha: string, emotion: string, comments: string) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
      .set('user_id', user_id.toString())
      .set('fecha', fecha)
      .set('emotion', emotion)
      .set('comments', comments);

    return this.http.post(environment.moodifyApiUrl+'users/save_emotion.php', body, { headers });
  }

  public listEmotions(user_id: number) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
      .set('user_id', user_id.toString());

    return this.http.post(environment.moodifyApiUrl+'users/list_emotions.php', body, { headers });
  }
}
