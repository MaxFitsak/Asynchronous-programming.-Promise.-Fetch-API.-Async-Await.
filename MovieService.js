export class MovieService {
  #baseUrl = 'https://www.omdbapi.com/';
  #apiKey;

  constructor(apiKey) {
    this.#apiKey = apiKey;
  }

  async #request(params) {
    const url = new URL(this.#baseUrl);
    url.search = new URLSearchParams({ apikey: this.#apiKey, ...params });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  }

  async search(title, type, page = 1) {
    return this.#request({ s: title, type, page });
  }

  async getMovie(movieId) {
    return this.#request({ i: movieId, plot: 'full' });
  }
}
