const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder")
let movieArray = [];
let idArray = [];

function fetchData() {
  movieArray = [];
  idArray = [];
  fetch(`https://www.omdbapi.com/?apikey=f7bb0b29&s=${search.value}`)
    .then(res => res.json())
    .then(data => {
      movieArray = data.Search;
      movieArray.forEach(movie => {
        idArray.push(movie.imdbID);
      });
      renderSearchedMovies();
    });
}
function renderSearchedMovies() {
  if (placeholder.style.display === 'flex') {
    placeholder.style.display = 'none';
  }
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
              <div class="movie-rating">⭐ ${movieRating.Value}</div>
            </div>
            <div class="movie-info-2">
              <div class="movie-time">${data.Runtime}</div>
              <div class="movie-genres">${data.Genre}</div>
              <div class="add-to-watchlist">
                <img
                  src="./img/Icon (1).png"
                  alt="Add to watchlist button"
                  class="add-icon"
                />
                <p>Watchlist</p>
              </div>
            </div>
            <div class="movie-info-3">
              <p>${data.Plot}</p>
            </div>
          </div>
        </section>
        <div class="border-bottom"></div>
`;
        document.getElementById("movie-input").innerHTML = html;
        console.log(data.Ratings);
      });
  });
}

searchBtn.addEventListener("click", fetchData);
