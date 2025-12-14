const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const movieInput = document.getElementById("movie-input");

let movieArray = [];
let idArray = [];
export let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

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
              <button class="add-to-watchlist" id='watchlist-btn'>
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
    addMovieToWatchList(e.target.dataset.add);
    alert("Movie added to watchlist");
  } else if (e.target.dataset.delete) {
    deleteMovieFromWatchList(e.target.dataset.delete);
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




  

