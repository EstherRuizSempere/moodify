import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Emotions} from '../app/interfaces/emotions';

@Injectable({
  providedIn: 'root'
})
export class MoodsDataService {

  private moodsData = 'assets/data/emotions.json';

  constructor(private http: HttpClient) {
  }

  getData(): Observable<Emotions[]> {
    return this.http.get<Emotions[]>(this.moodsData);
  }
}
