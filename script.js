const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const movieInput = document.getElementById("movie-input");
const watchlistEl = document.getElementById("watchlistEl");

let movieArray = [];
let idArray = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function changeButton() {
  document.querySelectorAll(".add-to-watchlist").forEach(button => {
    button.addEventListener("click", function () {
      button.innerHTML = `<p>Added</p>`;
    });
  });
}

function fetchData() {
  movieArray = [];
  idArray = [];
  fetch(`https://www.omdbapi.com/?apikey=f7bb0b29&s=${search.value}`)
    .then(res => res.json())
    .then(data => {
      togglePlaceholder();
      movieArray = data.Search;
      if (movieArray) {
        movieArray.forEach(movie => {
          idArray.push(movie.imdbID);
        });
        renderSearchedMovies();
      } else {
        movieInput.innerHTML = `<p class='search-error'>Unable to find what you're 
        looking for. Please try another search.</p>`;
      }
    });
}
function renderSearchedMovies() {
  let html = "";
  idArray.forEach(id => {
    fetch(`https://www.omdbapi.com/?apikey=f7bb0b29&i=${id}`)
      .then(res => res.json())
      .then(data => {
        const movieRating = data.Ratings;
        html += `
        <section class='item-container'>
          <img src=${data.Poster} alt="${data.Title} movie poster" class="movie-img" />

          <div class="movie-text">
            <div class="movie-info-1">
              <h3 class="movie-title">${data.Title}</h3>
              <div class="movie-rating">⭐ ${movieRating[0].Value}</div>
            </div>
            <div class="movie-info-2">
              <div class="movie-time">${data.Runtime}</div>
              <div class="movie-genres">${data.Genre}</div>
              <button class="add-to-watchlist">
                <img
                  src="./img/Icon (1).png"
                  alt="Add to watchlist button"
                  class="add-icon"
                  data-add='${data.imdbID}'
                />
                <p data-add='${data.imdbID}'>Watchlist</p>
              </button>
            </div>
            <div class="movie-info-3">
              <p>${data.Plot}</p>
            </div>
          </div>
        </section>
        <div class="border-bottom"></div>
`;

        movieInput.innerHTML = html;
      });
  });
}
if (searchBtn) {
  searchBtn.addEventListener("click", fetchData);
}

function togglePlaceholder() {
  if (placeholder.style.display === "flex") {
    placeholder.style.display = "none";
  }
}

// Event listeners
document.addEventListener("click", e => {
  if (e.target.dataset.add) {
    changeButton();
    addMovieToWatchList(e.target.dataset.add);
    alert("Movie added to watchlist");
  } else if (e.target.dataset.delete) {
    deleteMovieFromWatchList(e.target.dataset.delete);
    alert("Movie removed from watchlist");
  }
});

function addMovieToWatchList(movieId) {
  fetch(`https://www.omdbapi.com/?apikey=f7bb0b29&i=${movieId}`)
    .then(res => res.json())
    .then(data => {
      watchlist.push(data);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    });
}

function deleteMovieFromWatchList(movieId) {
  const remove = watchlist.findIndex(movie => movie.imdbID === movieId);
  watchlist.splice(remove, 1);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchList();
}

export function renderWatchList() {
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
              <button class="add-to-watchlist">
                <img
                  src="./img/Icon (2).png"
                  alt="Remove from watchlist button"
                  class="add-icon"
                  data-delete='${movie.imdbID}'
                />
                <p data-delete='${movie.imdbID}'>Remove</p>
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
