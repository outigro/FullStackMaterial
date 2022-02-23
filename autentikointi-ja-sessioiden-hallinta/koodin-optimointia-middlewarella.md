# Koodin optimointia "middlewarella"

Ohjelmaa voidaan taas kerran optimoida toisteisen ja rönsyilevän koodin osalta. Sisäänkirjautumisen mahdollistavan session olemassaolon tarkastaminen jokaisen reitin kohdalla on toisteista työtä, joka on helppo optimoida. Käytetään tällä erää hyödyksi ns. "middlewarea".

Ideana on tehdä session ja siihen liittyvien oikeuksien tarkastamisesta funktio, joka ajetaan haluttujen reittien yhteydessä. Jos tarkastus päättyy epäsuotuisasti, käyttäjä ohjataan esim. palvelun kirjautumissivulle:

```javascript
function isAuthenticated(req, res, next) {
  // TARKISTETAAN KÄYTTÄJÄN TIEDOT, OHJATAAN CALLBACK-FUnKTIOON
  if (req.session.loggedin == true) return next();

  // Jos in onnistu,  ohjataan etusivulle
  res.redirect("/kirjaudu");
}
```

Tämän jälkeen tätä funktiota voidaan käyttää "välikätenä" reittien määrittelyssä:

```javascript
// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", isAuthenticated, function (req, res) {
  res.send("Welcome, " + req.session.username + ". You are now logged in!");
});
```

Samalla idealla myös esim. verkkpalvelun kirjautumissivulle tulijat voitaisiin ohjata suoraan käyttäjien sivulle, jos heillä on voimassaoleva kirjautuminen ja siihen liittyvä sessiotunniste selaimessa.

Alla vielä ohjelman koodi kokonaisuudessaan:

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
// Otetaan express-sessiot käyttöön
var session = require("express-session");
// Otetaan express-mysql-session käyttöön
var MySQLStore = require("express-mysql-session")(session);
// Määritellään yhteysparametrit tietokannalle
var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "logindemo",
};
// Luodaan uusi tietovarasto sessioita varten
var sessionStore = new MySQLStore(options);
// Otetaan body-parser -moduuli käyttöön
var bodyParser = require("body-parser");

var app = express();

app.use(
  session({
    name: "logindemo",
    resave: true,
    saveUninitialized: true,
    secret: "salausavain", // tätä merkkijonoa käytetään evästeen salaukseen
    cookie: { maxAge: 60 * 1000 * 30 }, // 60ms * 1000 = 60 s * 30 = 30 min
    // Tietokanta, johon sessiodata tallennetaan
    store: sessionStore,
  })
);

// Tarjoillaan staattisia sivuja tästä hakemistosta
app.use(express.static("./"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function isAuthenticated(req, res, next) {
  // TARKISTETAAN KÄYTTÄJÄN TIEDOT, OHJATAAN CALLBACK-FUnKTIOON
  if (req.session.loggedin == true) return next();

  // Jos in onnistu,  ohjataan etusivulle
  res.redirect("/kirjaudu");
}

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;

  // Jos tunnukset ovat oikeat, ohjataan käyttäjä uuteen reittiin
  if (email === "onni@sci.fi" && pass === "opiskelija") {
    // Kun tunnukset on todettu oikeiksi, asetetaan sessiomuuttujat
   
    req.session.loggedin = true;
    req.session.username = email;

    // Lopuksi ohjataan käyttäjä kirjautuneiden alueelle
    res.redirect("/userpage");
  } else res.redirect("/kirjaudu");
});

// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", isAuthenticated, function (req, res) {
  res.send("Welcome, " + req.session.username + ". You are now logged in!");
});
// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

// Oletusreitti joka tarjoillaan, mikäli muihin ei päädytty.
app.get("*", function (req, res) {
  res.send("Cant find the requested page", 404);
});

// Web-palvelimen luonti Expressin avulla
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

```

