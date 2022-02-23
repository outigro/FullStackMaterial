# Express sovelluskehys

Noden ympärille on rakennettu suuret määrät kirjastoluokkia sekä sovelluskehyksiä. Näiden ideana on nopeuttaa sovelluskehitystä ja tarjota yleisimmin käytettyjä toiminnallisuuksia käyttöön valmiina funktioina. Express lienee tunnetuimpia ja käytetyimpiä sovelluskehyksiä Nodelle ja sen päälle on rakennettu monia uudempiakin kirjastoja. Sitä markkinoidaan seuraavasti:

> Express is a minimal and flexible Node.js web application framework. It provides a robust set of features for web and mobile applications.

Käytännössä kehittäjä saa rakennettua sovelluksen toiminnallisuuksia vähemmällä koodilla käyttämällä Expressin valmiita toiminnallisuuksia. Sitä voisi verrata vaikkapa jQueryyn JavaScript-kehityksessä.

### Express-moduulin asennus ja käyttöönotto

Express ei kuulu Noden vakiokirjastoihin, minkä vuoksi se pitää asentaa ennen käyttöä. Asentaminen tapahtuu käyttäen npm-pakettimanageria ao. komennolla. Komennon suorittamisen jälkeen express-kirjasto on ladattu paikallisen projektin käyttöön ja sitä voidaan kutsua koodista require-komennolla.

```javascript
npm install express –save
```

### Web-palvelin ja reitit

Allaolevassa koodissa luodaan web-palvelin ja siihen kaksi eri reittiä. Lopuksi luodaan oletusreitti, joka suoritetaan aina, mikäli mihinkään edellisistä reiteistä ei päädytty.

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();

// Luodaan reitit ja niiden toiminnallisuudet
app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.get("/list", function(req, res) {
  res.send("Listing data from a file!");
});

// Oletusreitti joka tarjoillaan, mikäli muihin ei päädytty.
app.get("*", function(req, res) {
  res.send("Cant find the requested page", 404);
});

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function() {
  console.log("Example app listening on port 8081!");
});

```

### Staattisen sisällön tarjoaminen

Usein sovelluksen halutaan tarjoilevan staattisia HTML-sivuja käyttäjälle. Reittien koodaaminen näitä varten saattaa muodostua työlääksi mikäli sivuja on paljon. Lisäksi reittien kautta tarjoiltu HTML-sivu saattaa sisältää linkkejä muihin tiedostoihin \(kuvat, CSS ja JS -tiedostot\), joihin käyttäjän tulisi myös päästä käsiksi.  

Tätä varten Express voi sallia hakemistopuun, jonka sisältöä tarjoillaan vapaasti web-palvelimen kautta selaimelle. Tämä tapahtuu express.static\(\) -funktion avulla. Ao. koodin jälkeen Noden web-palvelin tarjoilee kaiken public-hakemiston sisällön sitä pyytäville.

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");

var app = express();

// Tarjoillaan sisältöjä public-hakemiston alta halukkaille
app.use(express.static("./public"));

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function() {
  console.log("Example app listening on port 8081!");
});
```

Edellinen koodi tarjoilee public-hakemiston sisällön web-selaimen juuresta \(http://localhost:8081/\). Sen sijaan jos sisällölle halutaan luoda reitti, sekin onnistuu seuraavasti:

```javascript
app.use('/omareitti', express.static("./public"))
```

