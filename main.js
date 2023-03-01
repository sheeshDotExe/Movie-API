import Key from "./key.json" assert { type: "json" };

const APIKey = Key["API-KEY"];
const APIUrl = `http://www.omdbapi.com/?apikey=${APIKey}`;

const searchForm = document.querySelector(".search-bar");
const searchBar = document.getElementById("search-field");
const searchResult = document.querySelector(".search-results");
const nextPage = document.querySelector(".next-page");

let page = 1;
let lastSearch = null;

function pageEvents() {
  const previous = document.getElementById("previous");
  if (previous != null) {
    previous.addEventListener("click", () => {
      page--;
      window.scrollTo(0, 0);
      handleSearch(lastSearch);
    });
  }
  const next = document.getElementById("next");
  if (next != null) {
    next.addEventListener("click", () => {
      page++;
      window.scrollTo(0, 0);
      handleSearch(lastSearch);
    });
  }
  console.log(next);
}

function renderResults(data) {
  searchResult.innerHTML = "";

  const pages = Math.ceil(data.totalResults / 10);

  for (const movie of data.Search) {
    searchResult.innerHTML += `<div class="movie">
            <div class="info">
            <h1 class="movie-title">${movie.Title}</h1>
            <p clas="movie-year">Year realeased: ${movie.Year}</p>
            </div>
            <img class="movie-poster" src="${movie.Poster}"></img>
        </div>`;
  }

  let pageBar = `<h1>Page ${page}/${pages}</h1><div>`;
  if (page > 1) {
    pageBar += `<button id="previous">previous page</button>`;
  }
  if (page < pages) {
    pageBar += `<button id="next">next page</button>`;
  }
  pageBar += "</div>";
  nextPage.innerHTML = pageBar;
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

async function handleSearch(value) {
  const data = await getSearchResults(value);
  renderResults(data);
  console.log(data);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  lastSearch = searchBar.value;
  handleSearch(searchBar.value);
});
