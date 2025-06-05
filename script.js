const imdb = [
  { name: "Avatar", year: 2009, budget: "$237 million", collection: "$2.8 billion" },
  { name: "The Avengers", year: 2012, budget: "$220 million", collection: "$1.52 billion" },
  { name: "Frozen II", year: 2019, budget: "$150 million", collection: "$1.45 billion" },
  { name: "The Dark Knight", year: 2008, budget: "$185 million", collection: "$1 billion" },
  { name: "Inception", year: 2010, budget: "$160 million", collection: "$829.9 million" },
  { name: "Interstellar", year: 2014, budget: "$165 million", collection: "$677.5 million" },
  { name: "Black Panther", year: 2018, budget: "$200 million", collection: "$1.35 billion" },
  { name: "Avengers: Infinity War", year: 2018, budget: "$356 million", collection: "$2.05 billion" },
  { name: "Avengers: Endgame", year: 2019, budget: "$356 million", collection: "$2.798 billion" },
  { name: "Spider-Man: Far From Home", year: 2019, budget: "$160 million", collection: "$1.13 billion" },
  { name: "Frozen", year: 2013, budget: "$150 million", collection: "$1.28 billion" },
  { name: "Beauty and the Beast", year: 2017, budget: "$160 million", collection: "$1.26 billion" },
];

function renderMovies(movieList) {
  const container = document.getElementById("movieContainer");
  container.innerHTML = "";

  if (movieList.length === 0) {
    container.innerHTML = "<p>No movies found. Try adding one!</p>";
    return;
  }

  movieList.forEach((movie, index) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <h3>${movie.name}</h3>
      <p><strong>Year:</strong> ${movie.year}</p>
      <p><strong>Collection:</strong> ${movie.collection}</p>
      <button class="btn danger" onclick="deleteMovie(${index})">🗑 Delete</button>
    `;

    container.appendChild(card);
  });
}

function addMovie() {
  const name = document.getElementById("nameInput").value.trim();
  const year = document.getElementById("yearInput").value.trim();
  const collection = document.getElementById("collectionInput").value.trim();

  if (!name || !year || !collection) {
    alert("Please fill all fields!");
    return;
  }

  imdb.push({ name, year, collection });
  clearFormInputs();
  renderMovies(imdb);
}

function deleteMovie(index) {
  if (confirm(`Are you sure you want to delete "${imdb[index].name}"?`)) {
    imdb.splice(index, 1);
    renderMovies(imdb);
  }
}

function searchMovie() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const filtered = imdb.filter(movie =>
    movie.name.toLowerCase().includes(query)
  );
  renderMovies(filtered);
}

function clearFormInputs() {
  document.getElementById("nameInput").value = "";
  document.getElementById("yearInput").value = "";
  document.getElementById("collectionInput").value = "";
}

window.onload = () => {
  renderMovies(imdb);
};
