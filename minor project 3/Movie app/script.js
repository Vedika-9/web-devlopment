const API_KEY = "caadc069";
const BASE_URL = "https://www.omdbapi.com/";

const form = document.getElementById("searchForm");
const input = document.getElementById("movieInput");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const results = document.getElementById("results");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  await searchMovies(query);
});

async function searchMovies(query) {
  showLoading();
  try {
    const params = new URLSearchParams({ apikey: API_KEY, s: query, type: "movie" });
    const res = await fetch(`${BASE_URL}?${params}`);
    if (!res.ok) throw new Error("Network error. Please try again.");

    const data = await res.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "No movies found. Try a different search.");
    }

    // Fetch full details (poster, rating, plot) for each result
    const detailedMovies = await Promise.all(
      data.Search.map(async (movie) => {
        const detailParams = new URLSearchParams({ apikey: API_KEY, i: movie.imdbID });
        const detailRes = await fetch(`${BASE_URL}?${detailParams}`);
        return detailRes.json();
      })
    );

    renderMovies(detailedMovies);
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
  }
}

function renderMovies(movies) {
  results.innerHTML = movies.map(({ Title, Year, Poster, imdbRating, Genre }) => {
    const posterSrc = Poster !== "N/A" ? Poster : "https://via.placeholder.com/200x280?text=No+Poster";
    return `
      <div class="movie-card">
        <img src="${posterSrc}" alt="${Title}">
        <div class="movie-info">
          <h3>${Title}</h3>
          <p>${Year} • ${Genre || "N/A"}</p>
          <span class="rating">⭐ ${imdbRating !== "N/A" ? imdbRating : "N/A"}</span>
        </div>
      </div>
    `;
  }).join("");

  loading.classList.add("hidden");
  errorMsg.classList.add("hidden");
}

function showLoading() {
  loading.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  results.innerHTML = "";
}

function showError(message) {
  loading.classList.add("hidden");
  results.innerHTML = "";
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}