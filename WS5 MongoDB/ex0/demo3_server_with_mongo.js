const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017/";

// Database Name
const dbName = "moviedb";
const collection = "movies";

// Inserted Database
var newMovie = {
  Title: "Star Wars: The Last Jedi",
  Year: "2017",
  imdbID: "tt2527336",
  Type: "movie",
  Poster:
    "https://m.media-amazon.com/images/M/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_SX300.jpg"
};
var manyMovies = [
  {
    Title: "Star Wars: Episode II - Attack of the Clones",
    Year: "2002",
    imdbID: "tt0121765",
    Type: "movie",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDAzM2M0Y2UtZjRmZi00MzVlLTg4MjEtOTE3NzU5ZDVlMTU5XkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg"
  },
  {
    Title: "Rogue One: A Star Wars Story",
    Year: "2016",
    imdbID: "tt3748528",
    Type: "movie",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_SX300.jpg"
  }
];

// Use connect method to connect to the server

MongoClient.connect(
  url,
  { useNewUrlParser: true },
  function(err, client) {
    if (err) console.log("Tapahtui virhe!");

    const db = client.db(dbName);
    // Insert a single document

    db.collection(collection).insertOne(newMovie, function(err, r) {
      console.log(r.insertedCount);

      // Insert multiple documents
      db.collection("inserts").insertMany(manyMovies, function(err, r) {
        console.log(r.insertedCount);
        client.close();
      });
    });
  }
);
