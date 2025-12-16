// Variables
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const movieContainer = document.getElementById("movie-input");
const watchlistEl = document.getElementById("watchlistEl");

const API_KEY = "f7bb0b29";

let searchResults = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

// Search

async function fetchMovies(query) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
  );
  const data = await res.json();
  return data.Search || [];
}

async function fetchMovieDetails(ids) {
  const requests = ids.map(id =>
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`).then(res =>
      res.json()
    )
  );
  return Promise.all(requests);
}

async function handleSearch() {
  placeholder?.classList.add("none");
  movieContainer.innerHTML = "";

  const movies = await fetchMovies(searchInput.value);

  if (!movies.length) {
    movieContainer.innerHTML = `
    <p class="search-error">
        Unable to find what you're looking for.
      </p>
    `;
    return;
  }

  const ids = movies.map(movie => movie.imdbID);
  searchResults = await fetchMovieDetails(ids);

  renderSearchResults();
}

function renderSearchResults() {
  movieContainer.innerHTML = searchResults
    .map(movie => {
      const inWatchlist = watchlist.some(
        saved => saved.imdbID === movie.imdbID
      );

      const rating = movie.Ratings?.[0]?.Value || "N/A";

      return `
      <section class="item-container">
          <img src="${movie.Poster}" class="movie-img" />

          <div class="movie-text">
            <div class="movie-info-1">
              <h3>${movie.Title}</h3>
              <div>⭐ ${rating}</div>
            </div>

            <div class="movie-info-2">
              <span>${movie.Runtime}</span>
              <span>${movie.Genre}</span>

              <button 
                class="add-to-watchlist"
                data-id="${movie.imdbID}"
                ${inWatchlist ? "disabled" : ""}
              >
              <img src="./img/Icon (1).png" alt="Add to watchlist button" class="add-icon" />
                ${inWatchlist ? "Added" : "Watchlist"}
              </button>
            </div>

            <p class="movie-info-3">${movie.Plot}</p>
          </div>
        </section>
        <div class="border-bottom"></div>
    `;
    })
    .join("");
}

// Watchlist

function addToWatchlist(id) {
  const movie = searchResults.find(m => m.imdbID === id);
  if (!movie) return;

  if (!watchlist.some(m => m.imdbID === id)) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    renderWatchlist()
  }
}

function removeFromWatchlist(id) {
  watchlist = watchlist.filter(movie => movie.imdbID !== id);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist()
}

export function renderWatchlist() {
  if (!watchlistEl) return;

  if (!watchlist.length) {
    watchlistEl.innerHTML = `
      <h2>Your watchlist is looking a little empty...</h2> 
      <div class="add-movies"> 
        <h3><a href='index.html'>Let's add some movies!</a></h3> 
      </div>;
    `;
    return;
  }

  watchlistEl.innerHTML = watchlist
    .map(movie => {
      const rating = movie.Ratings?.[0]?.Value || 'N/A';

      return `
        <section class="item-container">
          <img src="${movie.Poster}" class="movie-img" />

          <div class="movie-text">
            <div class="movie-info-1">
              <h3>${movie.Title}</h3>
              <div>⭐ ${rating}</div>
            </div>

            <div class="movie-info-2">
              <span>${movie.Runtime}</span>
              <span>${movie.Genre}</span>
              <button data-delete="${movie.imdbID}" class="add-to-watchlist">
              <img src="./img/Icon (2).png" alt="Remove from watchlist button" class="add-icon" data-delete='${movie.imdbID}' />
                Remove
              </button>
            </div>

            <p class="movie-info-3">${movie.Plot}</p>
          </div>
        </section>
        <div class="border-bottom"></div>
      `;
    })
    .join("");
}

// Events
searchBtn?.addEventListener("click", handleSearch);

document.addEventListener('click', e => {
  const addBtn = e.target.closest('[data-id]');
  const deleteBtn = e.target.closest('[data-delete]');

  if (addBtn) {
    addToWatchlist(addBtn.dataset.id);
    addBtn.textContent = 'Added';
    addBtn.disabled = true
  }

  if (deleteBtn) {
    removeFromWatchlist(deleteBtn.dataset.delete)
  }
});
