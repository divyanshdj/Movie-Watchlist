// Movie data structure
let movies = [];

// DOM Elements
const movieContainer = document.getElementById('movieContainer');
const noMoviesMessage = document.getElementById('noMoviesMessage');
const totalMoviesEl = document.getElementById('totalMovies');
const oldestYearEl = document.getElementById('oldestYear');
const highestGrossingEl = document.getElementById('highestGrossing');

// Initialize the app
function initApp() {
  loadMovies();
  renderMovies(movies);
  updateStats();
  checkDarkModePreference();
}

// Load movies from localStorage
function loadMovies() {
  const savedMovies = localStorage.getItem('movieverse-movies');
  if (savedMovies) {
    movies = JSON.parse(savedMovies);
  } else {
    // Load default movies if no saved data
    movies = [
      { name: "Avatar", year: 2009, collection: "$2.8 billion", rating: "⭐⭐⭐⭐", genre: "Sci-Fi", notes: "Groundbreaking visuals" },
      { name: "The Avengers", year: 2012, collection: "$1.52 billion", rating: "⭐⭐⭐⭐⭐", genre: "Action", notes: "Perfect superhero team-up" },
      { name: "The Dark Knight", year: 2008, collection: "$1 billion", rating: "⭐⭐⭐⭐⭐", genre: "Action", notes: "Heath Ledger's iconic Joker" },
      { name: "Inception", year: 2010, collection: "$829.9 million", rating: "⭐⭐⭐⭐", genre: "Sci-Fi", notes: "Mind-bending plot" },
      { name: "Interstellar", year: 2014, collection: "$677.5 million", rating: "⭐⭐⭐⭐", genre: "Sci-Fi", notes: "Emotional space journey" }
    ];
    saveMovies();
  }
}

// Save movies to localStorage
function saveMovies() {
  localStorage.setItem('movieverse-movies', JSON.stringify(movies));
  updateStats();
}

// Render movies to the DOM
function renderMovies(movieList) {
  movieContainer.innerHTML = '';
  
  if (movieList.length === 0) {
    noMoviesMessage.style.display = 'flex';
    return;
  }
  
  noMoviesMessage.style.display = 'none';
  
  movieList.forEach((movie, index) => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    card.innerHTML = `
      <div class="movie-card-header">
        <h3>${movie.name}</h3>
        <div class="movie-card-year">${movie.year}</div>
        ${movie.rating ? `<div class="movie-card-rating">${movie.rating}</div>` : ''}
      </div>
      <div class="movie-card-body">
        <div class="movie-card-detail">
          <span class="movie-card-detail-label"><i class="fas fa-money-bill-wave"></i> Collection</span>
          <span>${movie.collection || 'N/A'}</span>
        </div>
        ${movie.genre ? `
        <div class="movie-card-detail">
          <span class="movie-card-detail-label"><i class="fas fa-theater-masks"></i> Genre</span>
          <span>${movie.genre}</span>
        </div>` : ''}
        ${movie.notes ? `
        <div class="movie-card-notes">
          <i class="fas fa-sticky-note"></i> ${movie.notes}
        </div>` : ''}
      </div>
      <div class="movie-card-actions">
        <button class="btn edit" onclick="editMovie(${index})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn delete" onclick="deleteMovie(${index})">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      </div>
    `;
    
    movieContainer.appendChild(card);
  });
}

// Add a new movie
function addMovie() {
  const name = document.getElementById('nameInput').value.trim();
  const year = document.getElementById('yearInput').value.trim();
  const collection = document.getElementById('collectionInput').value.trim();
  const rating = document.getElementById('ratingInput').value;
  const genre = document.getElementById('genreInput').value;
  const notes = document.getElementById('notesInput').value.trim();
  
  if (!name || !year) {
    showAlert('Movie name and year are required!', 'error');
    return;
  }
  
  const newMovie = {
    name,
    year: parseInt(year),
    collection,
    rating,
    genre,
    notes
  };
  
  movies.push(newMovie);
  saveMovies();
  renderMovies(movies);
  clearFormInputs();
  showAlert('Movie added successfully!', 'success');
}

// Edit a movie
function editMovie(index) {
  const movie = movies[index];
  
  // Fill the form with movie data
  document.getElementById('nameInput').value = movie.name;
  document.getElementById('yearInput').value = movie.year;
  document.getElementById('collectionInput').value = movie.collection || '';
  document.getElementById('ratingInput').value = movie.rating || '';
  document.getElementById('genreInput').value = movie.genre || '';
  document.getElementById('notesInput').value = movie.notes || '';
  
  // Remove the movie from the array
  movies.splice(index, 1);
  
  // Update the UI
  saveMovies();
  renderMovies(movies);
  
  // Scroll to form
  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  
  showAlert('Movie loaded for editing. Update and click "Add Movie" to save.', 'info');
}

// Delete a movie
function deleteMovie(index) {
  if (confirm(`Are you sure you want to delete "${movies[index].name}"?`)) {
    movies.splice(index, 1);
    saveMovies();
    renderMovies(movies);
    showAlert('Movie deleted successfully!', 'success');
  }
}

// Clear all movies
function confirmClearAll() {
  if (confirm('Are you sure you want to delete ALL movies? This cannot be undone.')) {
    movies = [];
    saveMovies();
    renderMovies(movies);
    showAlert('All movies have been deleted.', 'success');
  }
}

// Search movies
function searchMovie() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  
  if (!query) {
    renderMovies(movies);
    return;
  }
  
  const filtered = movies.filter(movie => 
    movie.name.toLowerCase().includes(query) || 
    movie.year.toString().includes(query) ||
    (movie.genre && movie.genre.toLowerCase().includes(query)) ||
    (movie.notes && movie.notes.toLowerCase().includes(query))
  );
  
  renderMovies(filtered);
}

// Clear search
function clearSearch() {
  document.getElementById('searchInput').value = '';
  renderMovies(movies);
}

// Sort movies
function sortMovies() {
  const sortValue = document.getElementById('sortSelect').value;
  const [field, direction] = sortValue.split('-');
  
  movies.sort((a, b) => {
    // Handle numeric fields differently
    if (field === 'year') {
      return direction === 'asc' ? a.year - b.year : b.year - a.year;
    }
    
    // Handle collection (remove $ and parse)
    if (field === 'collection') {
      const getValue = (str) => {
        if (!str) return 0;
        const numStr = str.replace(/[^0-9.]/g, '');
        const multiplier = str.includes('billion') ? 1000 : 1;
        return parseFloat(numStr) * multiplier;
      };
      
      const aValue = getValue(a.collection);
      const bValue = getValue(b.collection);
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Default string comparison
    const aValue = a[field]?.toString().toLowerCase() || '';
    const bValue = b[field]?.toString().toLowerCase() || '';
    
    if (direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  
  renderMovies(movies);
}

// Update statistics
function updateStats() {
  totalMoviesEl.textContent = movies.length;
  
  if (movies.length === 0) {
    oldestYearEl.textContent = '-';
    highestGrossingEl.textContent = '-';
    return;
  }
  
  // Find oldest movie
  const oldest = movies.reduce((oldest, current) => 
    current.year < oldest.year ? current : oldest
  );
  oldestYearEl.textContent = oldest.year;
  
  // Find highest grossing movie
  const getCollectionValue = (movie) => {
    if (!movie.collection) return 0;
    const numStr = movie.collection.replace(/[^0-9.]/g, '');
    const multiplier = movie.collection.includes('billion') ? 1000 : 1;
    return parseFloat(numStr) * multiplier;
  };
  
  const highestGrossing = movies.reduce((highest, current) => 
    getCollectionValue(current) > getCollectionValue(highest) ? current : highest
  );
  
  highestGrossingEl.textContent = highestGrossing.name.split(' ')[0]; // Just show first word
}

// Clear form inputs
function clearFormInputs() {
  document.getElementById('nameInput').value = '';
  document.getElementById('yearInput').value = '';
  document.getElementById('collectionInput').value = '';
  document.getElementById('ratingInput').value = '';
  document.getElementById('genreInput').value = '';
  document.getElementById('notesInput').value = '';
}

// Export movies as JSON
function exportMovies() {
  if (movies.length === 0) {
    showAlert('No movies to export!', 'error');
    return;
  }
  
  const dataStr = JSON.stringify(movies, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportName = 'movieverse-collection-' + new Date().toISOString().slice(0, 10) + '.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
  
  showAlert('Collection exported successfully!', 'success');
}

// Show alert message
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Modal functions
function showAbout() {
  document.getElementById('aboutModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('aboutModal').style.display = 'none';
}

// Dark mode toggle
function toggleDarkMode() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('darkModeToggle');
  const currentTheme = root.getAttribute('data-theme');

  if (currentTheme === 'dark') {
    root.removeAttribute('data-theme');
    localStorage.setItem('movieverse-theme', 'light');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('movieverse-theme', 'dark');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  }
}

// Check for dark mode preference on load
function checkDarkModePreference() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('darkModeToggle');
  const savedTheme = localStorage.getItem('movieverse-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    root.setAttribute('data-theme', 'dark');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  } else {
    root.removeAttribute('data-theme');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkDarkModePreference);

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('aboutModal');
  if (event.target === modal) {
    closeModal();
  }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);