import { watchlist } from "./script.js";


const watchlistEl = document.getElementById("watchlistEl");

function renderWatchList() {
  if (watchlist.length === 0) {
    watchlistEl.innerHTML = `<h2>Your watchlist is looking a little empty...</h2>
        <div class="add-movies">
          <img src="./img/Icon (1).png" alt="add" class="add-icon">
        <h3><a href='index.html'>Let's add some movies!</a></h3>
        </div>`;
  } else {
    let html = "";
    watchlist.forEach(movie => {
      const movieRating = movie.Ratings;
      html += `
        <section class='item-container'>
          <img src=${movie.Poster} alt="${movie.Title} movie poster" class="movie-img" />

          <div class="movie-text">
            <div class="movie-info-1">
              <h3 class="movie-title">${movie.Title}</h3>
              <div class="movie-rating">⭐ ${movieRating[0].Value}</div>
            </div>
            <div class="movie-info-2">
              <div class="movie-time">${movie.Runtime}</div>
              <div class="movie-genres">${movie.Genre}</div>
              <button class="add-to-watchlist" id='watchlist-btn'>
                <img
                  src="./img/Icon (1).png"
                  alt="Remove from watchlist button"
                  class="add-icon"
                  data-add='${movie.imdbID}'
                />
                <p data-add='${movie.imdbID}'>Remove from Watchlist</p>
              </button>
            </div>
            <div class="movie-info-3">
              <p>${movie.Plot}</p>
            </div>
          </div>
        </section>
        <div class="border-bottom"></div>
`;
    });

    watchlistEl.innerHTML = html;
  }
}

renderWatchList();