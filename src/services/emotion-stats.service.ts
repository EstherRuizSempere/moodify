import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmotionStatsService {

  private url = environment.moodifyApiUrl+'emotions/get_user_emotion_stats.php';

  constructor(private http: HttpClient) {}

  getUserEmotionStats(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}?user_id=${userId}`);
  }
}
