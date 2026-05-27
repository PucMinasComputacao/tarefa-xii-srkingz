const API_KEY = "12b9bc878db8ccd01055478e6289c290";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const LANGUAGE = "pt-BR";

const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

async function fetchMovies(query = "") {
  let url;

  if (query.trim() === "") {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1`;
  } else {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}&page=1`;
  }

  try {
    showMessage("Carregando filmes...");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da API.");
    }

    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error(error);
    showMessage("Não foi possível carregar os filmes. Verifique a API Key ou sua conexão.");
    return [];
  }
}

function createMovieCard(movie) {
  const card = document.createElement("article");
  card.classList.add("movie-card");

  const poster = document.createElement("img");
  poster.classList.add("movie-poster");

  if (movie.poster_path) {
    poster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
    poster.alt = `Poster do filme ${movie.title}`;
  } else {
    poster.src = "https://via.placeholder.com/500x750?text=Sem+Poster";
    poster.alt = "Filme sem poster disponível";
  }

  const content = document.createElement("div");
  content.classList.add("movie-content");

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const year = document.createElement("p");
  year.classList.add("movie-info");
  year.textContent = `Ano: ${getMovieYear(movie.release_date)}`;

  const rating = document.createElement("p");
  rating.classList.add("movie-info");
  rating.textContent = `Nota média: ${movie.vote_average.toFixed(1)}`;

  const overview = document.createElement("p");
  overview.classList.add("movie-overview");
  overview.textContent = limitText(movie.overview || "Sinopse não disponível.", 140);

  content.appendChild(title);
  content.appendChild(year);
  content.appendChild(rating);
  content.appendChild(overview);

  card.appendChild(poster);
  card.appendChild(content);

  return card;
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    movieList.appendChild(card);
  });
}

function showMessage(text) {
  message.textContent = text;
}

function getMovieYear(date) {
  if (!date) {
    return "Não informado";
  }

  return date.split("-")[0];
}

function limitText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
}

async function searchMovies() {
  const query = searchInput.value;
  const movies = await fetchMovies(query);
  renderMovies(movies);
}

async function init() {
  const movies = await fetchMovies();
  renderMovies(movies);
}

btnSearch.addEventListener("click", searchMovies);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

init();
