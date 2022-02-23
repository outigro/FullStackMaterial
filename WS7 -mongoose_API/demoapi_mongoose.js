// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// Otetaan moduuli käyttöön
var mongoose = require("mongoose");
var uri =
  "mongodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/sample_mflix";

// Yhdistetään tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Määritellään User-niminen Schema, eli tietomalli taulukkoon tallennettavista olioista
const Movie = mongoose.model(
  "Movie",
  {
    title: String,
    year: Number,
    poster: String,
  },
  "movies"
);

// Luodaan reitit ja niiden toiminnallisuudet

// Tulostetaan kaikki leffat
app.get("/api/leffat", function (req, res) {
  // Movie.find({}, function(err, results) { ... } ). Kts: https://mongoosejs.com/docs/api.html#model_Model.find
  Movie.find({}, null, { limit: 10 }, function (err, results) {
    console.log(results);
    res.json(results, 200);
  });
});

// Lisätään yksi leffa
app.post("/api/lisaa", function (req, res) {
  console.log(req.body);
  res.send("Lisätään leffa: " + req.body.title + " (" + req.body.year + ")");
});

// Muokataan leffan tietoja id-numeron perusteella
app.put("/api/muokkaa/:id", function (req, res) {
  res.send("Muokataan leffaa id:llä: " + req.params.id);
});

// Poistetaan leffa id:n perusteella
app.delete("/api/poista/:id", function (req, res) {
  // Poimitaan id talteen ja välitetään se tietokannan poisto-operaatioon
  var id = req.params.id;

  Movie.findByIdAndDelete(id, function (err, results) {
    if (err) {
      console.log(err);
      res.json("Järjestelmässä tapahtui virhe.", 500);
    } else if (results == null) {
      res.json("Poistetavaa ei löytynyt.", 200);
    } else {
      console.log(results);
      res.json("Deleted " + id + " " + results.title, 200);
    }
  });
});

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function () {
  console.log("Kuunnellaan porttia 8081!");
});
