const results = document.getElementById('results');
const details = document.getElementById('details');

const NO_POSTER = 'https://placehold.co/70x100?text=No+poster';

const esc = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const poster = (url) => (url && url !== 'N/A' ? url : NO_POSTER);

export function clearDetails() {
  details.hidden = true;
  details.innerHTML = '';
}

export function showError(message) {
  clearDetails();
  results.hidden = false;
  results.innerHTML = `<p class="error">${esc(message)}</p>`;
}

export function renderFilms(films, currentPage, totalPages, { onDetails, onPage }) {
  clearDetails();
  results.hidden = false;
  results.innerHTML = `
    <h3>Films:</h3>
    <div class="films">
      ${films.map((f) => `
        <article class="film">
          <img src="${esc(poster(f.Poster))}" alt="${esc(f.Title)}">
          <div>
            <div class="type">${esc(f.Type)}</div>
            <div class="name">${esc(f.Title)}</div>
            <div>${esc(f.Year)}</div>
            <button data-id="${esc(f.imdbID)}">Details</button>
          </div>
        </article>`).join('')}
    </div>
    <div class="pagination"></div>`;

  results.querySelectorAll('.film button').forEach((btn) =>
    btn.addEventListener('click', () => onDetails(btn.dataset.id)));

  renderPagination(currentPage, totalPages, onPage);
}

function renderPagination(current, total, onPage) {
  if (total <= 1) return;
  const box = results.querySelector('.pagination');

  const makeBtn = (label, page, disabled = false) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener('click', () => onPage(page));
    box.append(b);
  };

  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);

  makeBtn('<<', current - 1, current === 1);
  for (let p = start; p <= end; p++) makeBtn(p, p, p === current);
  makeBtn('>>', current + 1, current === total);
}

export function renderDetails(m) {
  const rows = [
    ['Title', m.Title], ['Released', m.Released], ['Genre', m.Genre],
    ['Country', m.Country], ['Director', m.Director], ['Writer', m.Writer],
    ['Actors', m.Actors], ['Awards', m.Awards],
  ];
  details.hidden = false;
  details.innerHTML = `
    <h3>Film info:</h3>
    <div class="info">
      <img src="${esc(poster(m.Poster))}" alt="${esc(m.Title)}">
      <dl>${rows.map(([k, v]) => `<dt>${k}:</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    </div>`;
  details.scrollIntoView({ behavior: 'smooth' });
}
