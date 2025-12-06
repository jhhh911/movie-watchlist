const search = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')

  function searchMovie() {
    fetch(`http://www.omdbapi.com/?apikey=f7bb0b29&s=${search.value}`)
  .then(res => res.json())
  .then(data => console.log(data))
  }

  searchBtn.addEventListener('click', searchMovie)