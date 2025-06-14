export interface Playlists {
  id: string | number;
  name: string;
  trackIds: string[]; // array de ids de canciones
  image?: string;
}
