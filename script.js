
imdb = [
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
function render(source) {
  html = "";
  for (i = 0; i < source.length; i++) {
    html += `<div class='cards'>
          <div class='title'>${source[i].name}</div>
          <div class='year'>${source[i].year}</div>
          <div class='collection'>${source[i].collection}</div>
          <div>
              <button class='btn' onclick='deleteMovie(${i})'>Delete</button>
          </div>
      </div>`;
  }
  demoObj = document.getElementById("demo");
  demoObj.innerHTML = html;
}

function filterMovie() {
  searchObj = document.getElementById("searchip");
  searchString = searchObj.value.toLowerCase();
  res = imdb.filter((movie) => {
    sourceString = Object.values(movie).join("").toLowerCase();
    const res = searchString
      .split("")
      .filter((char) => sourceString.includes(char));
    return res.length == searchString.length;
  });
  render(res);
}


function searchMovie() {
  searchOutput = [];
  searchObj = document.getElementById("searchinput");

  for (i = 0; i < imdb.length; i++) {
    if (imdb[i].name.toLowerCase().includes(searchObj.value.toLowerCase())) {
      searchOutput.push(imdb[i]);
    }
  }
  console.log("Matched Result = ", searchOutput);
  if (searchObj.value.length == 0) {
    searchOutput = imdb;
  }
  render(searchOutput);
}


function deleteMovie(index) {
  imdb.splice(index, 1);
  render(imdb);
}
function addMovie() {
  nameObj = document.getElementById("name");
  yearObj = document.getElementById("year");
  collectionObj = document.getElementById("collection");

  movieObj = {
    name: nameObj.value,
    year: yearObj.value,
    collection: collectionObj.value,
  };

  imdb.push(movieObj);
  render(imdb);
  console.log("IMDB Data = ", imdb);
}
