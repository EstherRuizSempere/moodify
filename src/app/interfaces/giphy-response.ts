export interface GiphyResponse {
  data: {
    images: {
      original: { url: string };
      fixed_width: { url: string };
    };
  };
}
