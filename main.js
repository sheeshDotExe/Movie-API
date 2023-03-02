import Key from "./key.json" assert { type: "json" };

const APIKey = Key["API-KEY"];
const APIUrl = `http://www.omdbapi.com/?apikey=${APIKey}`;

const searchForm = document.querySelector(".search-bar");
const searchBar = document.getElementById("search-field");
const searchResult = document.querySelector(".search-results");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const pageNumber = document.querySelector(".page");

let page = 1;
let lastSearch = null;
let hasPrevious = false;
let hasNext = false;

function nextPage() {
  page++;
  window.scrollTo(0, 0);
  handleSearch(lastSearch);
}

function previousPage() {
  page--;
  window.scrollTo(0, 0);
  handleSearch(lastSearch);
}

function pageEvents() {
  if (hasPrevious) {
    previous.addEventListener("click", previousPage);
  } else {
    previous.removeEventListener("click", previousPage);
  }
  if (hasNext) {
    next.addEventListener("click", nextPage);
  } else {
    next.removeEventListener("click", nextPage);
  }
}

function renderResult(movie) {
  searchResult.innerHTML = `<div class="movie-info">
    <img class="movie-poster" src="${movie.Poster}">
    <div class="info-box">
    <h1 class="movie-title">${movie.Title}</h1>
    <h2 class="movie-rating">${movie.imdbRating}</h2>
    <p class="movie-genre">${movie.Genre}</p>
    <p class="movie-plot">${movie.Plot}</p>
    </div>
  </div>`;
}

function renderResults(data) {
  searchResult.innerHTML = "";

  const pages = Math.ceil(data.totalResults / 10);

  for (const movie of data.Search) {
    const moviePage = document.createElement("div");
    moviePage.className = "movie";
    moviePage.addEventListener("click", () => {
      getMovie(movie.imdbID);
    });
    moviePage.innerHTML = `
            <div class="info">
            <h1 class="movie-title">${movie.Title}</h1>
            <p clas="movie-year">Year realeased: ${movie.Year}</p>
            </div>
            <img class="movie-poster" src="${movie.Poster}"></img>`;
    searchResult.appendChild(moviePage);
  }

  pageNumber.innerHTML = `Page ${page}/${pages}`;
  hasPrevious = page > 1 ? true : false;
  hasNext = page < pages ? true : false;
  pageEvents();
}

async function getSearchResults(url) {
  const result = await fetch(APIUrl + `&s=${url}&page=${page}`);
  if (!result.ok) {
    console.error(`failed to fetch ${url}`);
    return null;
  }
  return await result.json();
}

async function getMovie(movieId) {
  const result = await fetch(APIUrl + `&i=${movieId}`).then((data) =>
    data.json()
  );
  renderResult(result);
}

async function handleSearch(url) {
  const data = await getSearchResults(url);
  renderResults(data);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  lastSearch = searchBar.value;
  handleSearch(searchBar.value);
});
