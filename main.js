import { MovieService } from './MovieService.js';
import { renderFilms, renderDetails, showError } from './ui.js';

const API_KEY = '76c9b839';
const PER_PAGE = 10;

const service = new MovieService(API_KEY);
const form = document.getElementById('search-form');
const titleInput = document.getElementById('title');
const typeSelect = document.getElementById('type');

let query = { title: '', type: 'movie' };

async function loadPage(page) {
  try {
    const data = await service.search(query.title, query.type, page);

    if (data.Response === 'False') {
      showError(data.Error === 'Movie not found!' ? 'Movie not found!' : data.Error);
      return;
    }

    const totalPages = Math.ceil(Number(data.totalResults) / PER_PAGE);
    renderFilms(data.Search, page, totalPages, {
      onDetails: showDetails,
      onPage: loadPage,
    });
  } catch (err) {
    showError(`Помилка запиту: ${err.message}`);
  }
}

async function showDetails(id) {
  try {
    renderDetails(await service.getMovie(id));
  } catch (err) {
    showError(`Помилка запиту: ${err.message}`);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  query = { title: titleInput.value.trim(), type: typeSelect.value };
  if (query.title) loadPage(1);
});
