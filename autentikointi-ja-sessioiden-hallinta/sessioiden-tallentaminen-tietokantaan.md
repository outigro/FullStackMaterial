# Sessioiden tallentaminen tietokantaan

Express-session moduuli ylläpitää sessionhallintaan liittyviä tietoja itse hallinnoimassaan tietorakenteessa. Tämä toimii hyvin pienissä toteutuksissa mutta käyttäjämäärän ja sessiodatan lisääntyessä tarvitaan suorituskykyisempää tietokantaratkaisua. Katsotaan seuraavaksi läpi muutama esimerkki tällaisista.

### MySQL

MySQL:n käyttäminen sessiodatan tallentamiseen onnistuu näppärästi [express-mysql-session -moduulin](https://www.npmjs.com/package/express-mysql-session) avulla. Asennetaan se komennolla:

```javascript
npm i express-mysql-session 
```

Tämän jälkeen aiempaan ohjelmaan lisätään muutamia rivejä:

```javascript
// Otetaan express-mysql-session moduuli käyttöön
var MySQLStore = require("express-mysql-session")(session);

// Määritellään yhteysparametrit tietokannalle
var options = {
  host: "localhost",
  port: 3306,
  user: "root", // HUOM. Vain root-tunnusta käytetään vain testikäytössä 
  password: "", // HUOM. Todellisuudessa tyhjä salasana on tietoturvariski! 
  database: "logindemo",  // Tallennetaan sessiodata logindemo-tietokantaan
};
// Luodaan uusi tietovarasto sessioita varten
var sessionStore = new MySQLStore(options);
```

Tämän jälkeen riittää, että cookien asetuksiin lisätään store-muuttuja, joka määrittelee sessiodatan tallenuspaikaksi yllä luodun sessionStore-muuttujan:

```javascript
// Märitellään session asetukset
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
```

Muita muutoksia ei tarvita, ohjelma toimii tämän jälkeen samaan tapan kuin aiemmin. Erona kuitenkin se, että session tiedot tallennetaan MySQL-tietokantaan. Selain kuljettaa edelleen salattua yksilöllistä tunnistetta, jolla sessioon liittyvä data yhdistetään käyttäjään. Sessiotiedot poistetaan automaattisesti tietyin väliajoin rakenteesta.

Onnistuneen kirjautumisen jälkeen tietokantaan luodaan session-niminen taulukko, joka pitää sisällöön kentät session\_id, expires sekä data. Users-taulu on luotu aiemmissa esimerkeissä.

![Kuva: Tietokannan rakenne DBeaver-sovelluksella katsottuna.](../.gitbook/assets/image%20%2875%29.png)

Sisäänkirjautuminen tuottaa Sessions-tauluun alla näkyvän rivin. Käytännössä se sisältää session yksilöivän tunnisteen, expires-päivän tiedon sekä data-kentän. Data-kenttä sisältää kaikki Node:n sesioon tallentamat tiedot, kuten username- sekä loggedIn- arvot.

![Kuva: Sis&#xE4;&#xE4;nkirjautumisen tuottama rivi \(klikkaa suuremmaksi\).](../.gitbook/assets/image%20%2871%29.png)

Kurkistetaan vielä kehittäjän työkalujen kautta selaimeen tallennettuun evästeeseen. Huomaa, että sen arvo \(value\) vastaa palvelimen tietokantaan tallentamaa session\_id:tä: 

![Kuva: Selaimeen tallennettu ev&#xE4;ste.](../.gitbook/assets/image%20%2870%29.png)

Alla vielä koodi kokonaisuudessaan:

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

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;

  // Jos tunnukset ovat oikeat, ohjataan käyttäjä uuteen reittiin
  if (email === "onni@sci.fi" && pass === "opiskelija") {
    // Kun tunnukset on todettu oikeiksi, asetetaan sessiomuuttujat
    // jotka muistavat että kirjautuminen on onnistunut ja otetaan myös
    // käyttäjänimi talteen

    req.session.loggedin = true;
    req.session.username = email;
    console.log(req.session);
    // Lopuksi ohjataan käyttäjä kirjautuneiden alueelle
    res.redirect("/userpage");
  } else res.redirect("/");
});

// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function (req, res) {
  if (req.session.loggedin == true) {
    res.send("Welcome, " + req.session.username + ". You are now logged in!");
  } else res.redirect("/");
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

Autentikointiin ja sessioiden hallintaan liittyviä asioita on esitelty hyvin. seuraavsaa blogissa: [https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions](https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions)

### MongoDB sessionhallinnassa

Myös MongoDB voi toimia sessioiden tallennuspaikkana. Muutokset koodiin ovat aika pieniä. Asennetaan ensin sopiva moduuli:

```javascript
npm i connect-mongodb-session
```

Sitten määritellään yhteysparametrit ja asetetaan eväste käyttämään uutta tietokantaa:

```javascript
// Otetaan mongodb-session moduuli käyttöön
var MongoDBStore = require("connect-mongodb-session")(session);

// Määritellään yhteysparametrit tietokannalle
var sessionStore = new MongoDBStore({
  uri: "mongodb://localhost:27017/logindemo", // tietokannan osoite
  collection: "mySessions",                   // kokoelman nimi
});

 ...
 // Asetetaan eväste käyttämään uutta sessionStore-muuttujaa
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
```

### Redis

Redis on suosittu NoSQL-pohjainen tietokanta joka käsittelee tietoja keskusmuistissa \(memory-store\) mikä tekee siitä todella nopean.  Redisin käyttöönotto onnistuisi samalla tapaa kuin edellä, eli sopivan moduulin asentaminen, yhteysosoitteen määrittäminen sekä evästeen asetusten päivittäminen. 

```javascript
// Tarvittavat Redis moduulit
const redis = require('redis');
const RedisStore = require('connect-redis')(session)

// Yhteysosoitteen määrittely
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})
// Uusi sessionStore-muuttuja
var sessionStore = new RedisStore({ client: redisClient });

...
 // Asetetaan eväste käyttämään uutta sessionStore-muuttujaa
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
```

