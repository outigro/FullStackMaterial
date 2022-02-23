////////////////////////////////////////////////////////////
// Express määrittelyt
// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();

// otetaan EJS käyttöön
app.set("view engine", "ejs");

// Tällä pakotetaan sivupohja tuottamaan sisennettyä, kaunista HTML:ää.
// Tuotantokäytössä asetus voi olla false jolloin sivujen koko pienenee hieman
app.locals.pretty = true;

////////////////////////////////////////////////////////////
// MongoDB: n koodi
////////////////////////////////////////////////////////////

// Tuodaan moduuli ohjelmaan
const MongoClient = require("mongodb").MongoClient;

// Määritellään salasana ja yhteysosoite tietokantaan (tämän saa MongoDB Atlas-palvelusta)
const passwd = "demopass";
const uri =
  "mongodb+srv://dbuser:" +
  passwd +
  "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

// Luodaan uusi yhteysolio käyttäen edellä määriteltyä URI:a sekä
// tarvittavia parametreja
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Määritellään tietokantaan tehtävä kyselu JSON-oliona. Tässä voi käyttää
// apuna esim. MondoDB Compass -työkalua. Tämä kysely hakee kaikkia elokuvia
// joiden nimessä esiintyy sana "Jedi"
var query = {
  title: new RegExp("Jedi")
};

// Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
  if (err) throw err;

  //////////////////////////////////////////
  // Express - palvelimen luonti
  //////////////////////////////////////////

  app.listen(8081, () => {
    // Luodaan reitit ja niiden toiminnallisuudet
    app.get("/", function(req, res) {
      res.send("Hello World!");
    });

    app.get("/leffat", (req, res) => {
      collection.find(query).toArray(function(err, results) {
        console.log(results);
        res.render("pages/leffat", { taulu: results });
      });
    });
  }); // end app.listen
  ////////////////////////////////
});
