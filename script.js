
imdb = [
  { name: "Avengers", year: 2008, collection: "100mil" },
  { name: "Thor", year: 2010, collection: "60mil" },
  { name: "Hulk", year: 2012, collection: "70mil" },
  { name: "C. America", year: 2009, collection: "90mil" },
  { name: "Spiderman", year: 2020, collection: "140mil" },
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
