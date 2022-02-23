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

//////////////////////////////////////////
// Express - palvelimen luonti
//////////////////////////////////////////

app.listen(8081, () => {
  // Luodaan reitit ja niiden toiminnallisuudet

  app.get("/leffat", (req, res) => {
    // Kutsutaan tietokantahakua getResults() -funktion kautta.
    // Välitetään ekana parametrina hakusana, toisena parametrina anonyymi funktio joka käsittele vastauksen
    var results = getResult("Star Wars", function(err, result) {
      console.log(result);
      res.render("pages/leffat", { taulu: result });
    });
  });
}); // end app.listen
////////////////////////////////

function getResult(query, callback) {
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

  // Määritellään tietokantaan tehtävä kyselu JSON-oliona. Tämä kysely hakee kaikkia elokuvia
  // joiden nimessä esiintyy sana joka välitettiin parametrina reitistä
  var query = {
    title: new RegExp(query)
  };

  // Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
  client.connect(err => {
    const collection = client.db("sample_mflix").collection("movies");
    if (err) throw err;

    collection
      .find(query)
      .sort({ year: -1 })
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        client.close();
        // Kutsutaan parametrina reitistä saatua funktiota, joka käsittelee vastauksen
        callback(err, result);
      });
  });
}
