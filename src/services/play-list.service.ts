import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Playlists} from '../app/interfaces/playlists';

@Injectable({
  providedIn: 'root'
})
export class PlayListService {
  private playlistsUrl = 'assets/data/playlists.json';

  constructor(private http: HttpClient) {
  }

  getPlaylists(): Observable<Playlists[]> {
    return this.http.get<Playlists[]>(this.playlistsUrl);
  }
}
