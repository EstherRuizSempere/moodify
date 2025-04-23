export interface Track  {
  id: number | string;
  name:string;
  artist: string;
  album: string;
  imageUrl?: string;
  durationMs: number;
  playedAt?: Date;
  songUrl?: string;
  isLiked?: boolean;
}
