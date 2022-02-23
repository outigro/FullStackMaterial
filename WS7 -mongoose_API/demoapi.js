// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// Luodaan reitit ja niiden toiminnallisuudet

// Tulostetaan kaikki leffat
app.get("/api/leffat", function(req, res) {
  res.send("Tulostetaan kaikki leffat.");
});

// Lisätään yksi leffa
app.post("/api/lisaa", function(req, res) {
  console.log(req.body);
  res.send("Lisätään leffa: " + req.body.title + " (" + req.body.year + ")");
});

// Muokataan leffan tietoja id-numeron perusteella
app.put("/api/muokkaa/:id", function(req, res) {
  res.send("Muokataan leffaa id:llä: " + req.params.id);
});

// Poistetaan leffa id:n perusteella
app.delete("/api/poista/:id", function(req, res) {
  res.send("Poisteaan leffa id:llä: " + req.params.id);
});

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function() {
  console.log("Kuunnellaan porttia 8081!");
});
