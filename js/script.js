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

// local storage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

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
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
        <div class="movie__cover-inner">
          <img
            src="${movie.posterUrlPreview}"
            class="movie__cover"
            alt="${movie.nameRu}"
          />
          <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie__info">
          <div class="movie__title">${movie.nameRu}</div>
          <div class="movie__category">${movie.genres.map(
            (genre) => ` ${genre.genre}`
          )}</div>
          ${
            movie.rating &&
            `
          <div class="movie__average movie__average--${getClassByRate(
            movie.rating
          )}">${movie.rating}</div>
          `
          }
        </div>
      `;
      movieEl.addEventListener('click', () => openpopup(movie.filmId));
      moviesEl.appendChild(movieEl);
    });
  } else {
    moviesEl.innerHTML = '<p>Фильмы не найдены</p>'; // выводим сообщение, если фильмы отсутствуют
  }
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = '';
  }
});

// popup
const popupEl = document.querySelector('.popup');

async function openpopup(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
  });
  const respData = await resp.json();

  popupEl.classList.add('popup--show');
  document.body.classList.add('stop-scrolling');

  popupEl.innerHTML = `
    <div class="popup__card">
      <img class="popup__movie-backdrop" src="${respData.posterUrl}" alt="">
      <h2>
        <span class="popup__movie-title">${respData.nameRu}</span>
        <span class="popup__movie-release-year"> - ${respData.year}</span>
      </h2>
      <ul class="popup__movie-info">
        <div class="loader"></div>
        <li class="popup__movie-genre">Жанр - ${respData.genres.map(
          (el) => `<span>${el.genre}</span>`
        )}</li>
        ${
          respData.filmLength
            ? `<li class="popup__movie-runtime">Время - ${respData.filmLength} минут</li>`
            : ''
        }
        <li >Сайт: <a class="popup__movie-site" href="${respData.webUrl}">${
    respData.webUrl
  }</a></li>
        <li class="popup__movie-overview">Описание - ${
          respData.description
        }</li>
      </ul>
      <button type="button" class="popup__button-close">X</button>
    </div>
  `;
  const btnClose = document.querySelector('.popup__button-close');
  btnClose.addEventListener('click', () => closepopup());
}

function closepopup() {
  popupEl.classList.remove('popup--show');
  document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (e) => {
  if (e.target === popupEl) {
    closepopup();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    closepopup();
  }
});
