const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL_POPULAR =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH =
  'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_MOVIE_DETAILS =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const API_URL_BEST =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1';
const API_URL_COMING_SOON =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS&page=1';
const API_POPULAR_TVS =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2023&month=MAY';

// загружаем сохраненные фильмы при загрузке страницы
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return 'green';
  } else if (vote > 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

// popular
const mostPopularMovies = document.getElementById('mostPopularMovies');
mostPopularMovies.addEventListener('click', () => {
  getMovies(API_URL_BEST);
});

// serials
const mostPopularSerials = document.getElementById('mostPopularSerials');
mostPopularSerials.addEventListener('click', () => {
  getMovies(API_POPULAR_TVS);
});

// coming soon
const comingSoon = document.getElementById('comingSoon');
comingSoon.addEventListener('click', () => {
  getMovies(API_URL_COMING_SOON);
});

function showMovies(data) {
  const moviesEl = document.querySelector('.movies');

  // Очищаем предыдущие фильмы
  document.querySelector('.movies').innerHTML = '';

  if (data.films) {
    // проверяем наличие фильмов
    data.films.forEach((movie) => {
      const isFavorite = favoriteMovies.some(
        (favoriteMovie) => favoriteMovie.filmId === movie.filmId
      ); // проверяем, является ли фильм избранным
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
    });
  }
}
