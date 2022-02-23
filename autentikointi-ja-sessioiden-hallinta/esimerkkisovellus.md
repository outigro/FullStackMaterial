# Esimerkkisovellus

Katsotaan seuraavasti esimerkki sessionhallinnan toteuttamisesta sisäänkirjautumislomakkeelle. 

### Session alustus

Otetaan pohjalle aiemmista esimerkeistä tuttu [sisäänkirjautumisen koodi](https://app.gitbook.com/@mika-stenberg/s/mean-web-development/express-sovelluskehys/lomakkeiden-kaesittely). Jotta esimerkki pysyisi yksinkertaisena, jätetään tietokantatoiminnallisuus esimerkin ulkopuolelle. Sessionhallinnassa hyödynnetään [express-session -moduulia](https://www.npmjs.com/package/express-session), joten asennetaan se \(npm i express-session\)  ja lisätään tuontilause koodin alkuun. Bodyparseria käytetään lomakkeen tietojen lukemiseen, myös JSONin käsittely kytketään päälle \(rivi 8\).

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
// Otetaan express-sessiot käyttöön
var session = require("express-session");

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
```

Session asetukset \(nimi, salausavain, voimassaoloaika\) tulee määrittää koodissa seuraavasti:

```javascript
var app = express();
// Asetetaan sessiomuuttujan tiedot
app.use(
  session({
    name: "logindemo",          // nimi
    resave: true,               // oletusarvo
    saveUninitialized: true,    // oletusarvo
    secret: "salausavain",      // tätä merkkijonoa käytetään evästeen salaukseen
    // voimassaoloaika, jonka jälkeen sessio vanhenee
    cookie: { maxAge: 60 * 1000 * 30 }, // 60s * 1000ms = 60 s * 30 = 30 min
  })
);
```

### Sisäänkirjautuminen

Reittiin, jossa käyttäjä tunnistetaan, lisätään koodi joka tallentaa onnistuneen kirjautumisen tiedot sessiomuuttujaan \(rivit 14 ja 15\). Onnistunut sisäänkirjautuminen aiheuttaa selaimen uudelleenohjauksen tutulle sivulle /userpages:

```javascript
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

    // Lopuksi ohjataan käyttäjä kirjautuneiden alueelle
    res.redirect("/userpage");
  } else res.redirect("/");
});
```

Reitissä /userpages tutkitaan sessiomuuttujaa. Mikäli se sisältää tiedot onnistuneesta sisäänkirjautumisesta, esitetään käyttäjälle tervetuloilmoitus. Muulloin käyttäjä ohjataan kirjautumissivulle. Huomaa, että käyttäjä voi käydä välillä muillakin sivuilla ja palatessaan päästä kuitenkin kirjautuneiden käyttäjien alueelle.

Kirjautunut käyttäjä voit myös kirjautua ulos klikkaamalla logout-linkkiä. Tämä vie käyttäjän /logout -reittiin, joka tuhoaa evästeen tiedot palvelimelta. 

```javascript
// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function (req, res) {
// Tarkistetaan löytyykö sessiosta tieto onnistuneesta kirjautumisesta
  if (req.session.loggedin == true) {
    // Huomaa, että sessiomuuttujasta voidaan kaivaa myös tieto käyttäjän nimestä
    res.send(
      "Welcome, " +
        req.session.username +
        ". You are now logged in!. You can logout <a href='/logout'>here</a>"
    );  } else res.redirect("/");
});
// Uloskirjautuminen, jossa sessio tuhotaan
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    console.log("Session tiedot tuhottu.");
    res.redirect("/");
  });
});
```

Onnistunut sisäänkirjautuminen tuottaa ao. näkymän selaimessa. Huomaa, että session tiedoista luetaan kirjautuneen käyttäjän sähköpostiosoite.

![](../.gitbook/assets/image%20%2874%29.png)

Kehittäjän työkaluista voidaan seurata, miten palvelimen vastauksena saadaan salattu eväste   
\(Network-&gt;Headers-&gt;Cookie\).

![](../.gitbook/assets/image%20%2869%29.png)

Saman työkalun avulla voidaan myös tutkia miten eväste on tallennettu selaimeen \(Application-&gt;Storage-&gt;Cookies\). Koodissa asetettu evästeen nimi \(logindemo\) sekä evästeen salattu sisältö on näkyvillä. Tämä eväste kulkee mukana kaikissa sivupyynnöissä saman domainin sisällä.

![](../.gitbook/assets/image%20%2872%29.png)

Alla vielä ohjelman koodi kokonaisuudessaan:

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
// Otetaan express-sessiot käyttöön
var session = require("express-session");

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

    // Lopuksi ohjataan käyttäjä kirjautuneiden alueelle
    res.redirect("/userpage");
  } else res.redirect("/");
});

// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function (req, res) {
// Tarkistetaan löytyykö sessiosta tieto onnistuneesta kirjautumisesta
  if (req.session.loggedin == true) {
    // Huomaa, että sessiomuuttujasta voidaan kaivaa myös tieto käyttäjän nimestä
    res.send(
      "Welcome, " +
        req.session.username +
        ". You are now logged in!. You can logout <a href='/logout'>here</a>"
    );  } else res.redirect("/");
});
// Uloskirjautuminen, jossa sessio tuhotaan
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    console.log("Session tiedot tuhottu.");
    res.redirect("/");
  });
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

### 

