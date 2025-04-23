// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, map } from 'rxjs'; // Importa map de RxJS
// import { Song } from '../app/interfaces/song';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class SpotifyService {
//   private TOKEN = "BQAWhR5HPeYKUNTBmIeHaDOUm37gH9b8Lr0-aKWawMD9KHOijJ_EJZbMh_IOEmtw0ouVxP4HJHE352PipI80TkqbuLYEh3g5BifeQTKqk4lPomrZwofCSR2ztXJBnEjUlC9XEUlxm-c";
//
//   constructor(private http: HttpClient) {}
//
//   getArtistAndAlbums(): Observable<Song[]> {
//     const headers = new HttpHeaders({
//       'Authorization': 'Bearer ' + this.TOKEN
//     });
//
//     return this.http.get("https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb", { headers })
//       .pipe(
//         map((data: any) => {
//           const albums = data.albums?.items || [];
//           return albums.map((item: any) => ({
//             image: item.images[0]?.url, // Usa optional chaining por si images está vacío
//             name: item.name
//           }));
//         })
//       );
//   }
// }
