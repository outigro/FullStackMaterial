# MongoDB ja Node

### MongoDB

MongoDB on tällä hetkellä suosituin ja ehkä myös pisimmälle tuotteistettu NoSQL-tietokanta. Siitä on saatavilla ilmainen Community versio sekä järeämpi ja maksullinen Enterprise versio. Mongon voi ladata ilmaiseksi [täältä](https://www.mongodb.com/what-is-mongodb). MongoDB on tarjolla myös pilvipalveluna eri toimijoiden kautta. Näppärimmin sitä pääsee kokeilemaan MongoDB Atlas -palvelulla, jonne pienen testiympäristön saa luotua ilmaiseksi. Löydät sen [täältä](https://www.mongodb.com/).

Tämän sivun esimerkeissä käytetään MongoDB Atlas -pilvipalvelussa sijaitsevaa tietokantaa. Koodissa tämä näkyy ainoastaan yhteysosoitteessa.

### MondoDB Compass ja tietokantahakujen luominen

Tietokannan käyttö näyttäytyy kehittäjälle yksinkertaisimmillaan terminaalikomentoina ja siihen tulostuvina tuloksina. Onneksi nykään on saatavilla näppäriä graafisia työkaluja, joilla paitsi datan selailu mutta myös hakujen tekeminen ja viilailu on huomattavasti helpompaa. Mongon kehittäjien tarjoama ilmainen työkalu on nimeltään Compass ja myös sen voi ladata tuotteen [kotisivuilta](https://www.mongodb.com/products/compass).

![Kuva: MongoDB Compassin graafinen n&#xE4;kym&#xE4; tietokantaan.](../.gitbook/assets/image%20%2856%29.png)

### Kyselyiden tekeminen

Mongo-tietokantaan tehdään kyselyjä erilaisilla funktioilla, joiden parametrit muodostuvat JavaScript-olioista. Tämä saattaa hämmentää SQL-kieleen tottunutta kehittäjää. Tietoja haetaan find\(\) -funktiolla ja lisätään insertOne\(\) -funktiolla. Lisäksi tiedon poistamiseen ja päivittämiseen on olemassa omat funktionsa. Operaatiot on kuvattu hyvin [tietokannan dokumentaatiossa](https://docs.mongodb.com/manual/crud/).

Alla esimerkki find\(\) -funktion käytöstä, joka kohdistuu tietokantaolion users-kokoelmaan. Huomaa funktion parametrina saamat JSON-muotoiset hakukriteerit \(query\) age: { $gt : 18 } sekä kentät jotka tulosjoukkoon \(projection\) halutaan :  {name: 1, address: 1}.  Hakutuloksien määrää voidaan rajoittaa vielä limit\(\) -funktiolla, joka rajaa palautettavien tulosten määrän viiteen.

![Kuva: Tietokantahaun yleinen rakenne MongoDB:ss&#xE4;.](../.gitbook/assets/image%20%2852%29.png)

## Esimerkkikyselytä

Seuraavat esimerkkikyselyt voidaan ajaa joko Compass-työkalussa, MogoDB Shellissä tai sitten Node.js:n kautta, kunhan yhteys tietokantaan on luotu. Haut määritellään JSON-muotoisina rakenteina, jotka syötetään joko suoraan Compass-työkalun hakukenttään tai find\(\)-funktion parametreiksi koodissa ja kometorivillä.

#### Kaikkien dokumenttien hakeminen

```javascript
// Tyhjät hakuehdot palauttavat kaikki kokoelman dokumentit
{ }
```

#### Nimen perusteella hakeminen

```javascript
// Haetaan dokumentit title-kentän mukaan 
{ title: "The Lord of the Rings" }
```

#### Ehtojen liittäminen AND operaatiolla

```javascript
// Haetaan titlen JA julkaisuvuoden mukaan
{title: "Blacksmith Scene", year: 1893 }
```

#### Ehtojen liittäminen OR operaatiolla

```javascript
// Haetaan titlen TAI julkaisuvuoden mukaan

{ $or: [ 
         { title: "The Terminator" }, 
         { year: { $lt: 1900 } } 
       ]
 }
```

#### Hakeminen säännöllisellä lausekkeella tai LIKE-tyyppisellä operaatiolla

```javascript
// Haetaan nimekkeitä jotka sisältävät sanan Terminator. 
//i-tarkenne tekee hausta case-insensitiven eli isojen ja pienien 
//kirjaimien eroja ei huomioida.
{title: /Terminator/i }
```

## MongoDB:n käyttäminen Nodessa

Jotta MongoDB-tietokanna vaatimia toimintoja päästään käyttämään Nodessa, tulee kehittäjän asentaa sopiva moduuli käyttöönsä. Tämä tapahtuu komennolla:

```bash
npm i mongodb 
```

Moduuli otetaan käyttöön Node.js -koodissa tavalliseen tapaan require-funktiolla.

```bash
const MongoClient = require("mongodb").MongoClient;
```

### Tietokantayhteyden luominen

Seuraavassa esimerkissä luodaan yhteys tietokantaan käyttämällä MongoDB-modulin työkaluja. Huomaa, että yhteysosoite saadaan taholta joka tietokantaa ylläpitää, tässä tapauksessa MongoDB Atlas-palvelusta. Jos tietokantaa ajetaan omalla koneella, yhteysosoite voisi olla esim. "mongodb://localhost:25021". Koodi ei tee vielä lainkaan hakuja tietokantaan. 

```javascript
// Tuodaan moduuli ohjelmaan
const MongoClient = require("mongodb").MongoClient;

// Määritellään salasana ja yhteysosoite tietokantaan (tämän saa MongoDB Atlas-palvelusta)
const passwd = "demopass";
const uri ="mongodb+srv://dbuser:"+passwd+"@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

// Luodaan uusi yhteysolio käyttäen edellä määriteltyä URI:a sekä 
// tarvittavia parametreja
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Luodaan yhteys ja tulostetaan tieto virheestä tai onnistumisesta
// virhetiedot palaututuvat err muuttujaan, hakujen tulokset r-muuttujaan
client.connect( function (err,r)  {
   if (err) throw err;
   else console.log("Connected!");
   
 // Suljetaan tietokantayhteys
    client.close();
});
```

### Tietokantahakujen tekeminen

Seuraavaksi tehdään yksinkertainen tietokantahaku MongoDB:hen.  Tietokantaan on ladattu Atlas-palvelun tarjoama esimerkkidatasetti, joka sisältää tietoja elokuvista. Ao. esimerkissä haetaan kaikki elokuvat joiden nimessä esiintyy sana "Jedi".

```javascript
// Tuodaan moduuli ohjelmaan
const MongoClient = require("mongodb").MongoClient;

// Määritellään salasana ja yhteysosoite tietokantaan (tämän saa MongoDB Atlas-palvelusta)
const passwd = "demopass";
const uri ="mongodb+srv://dbuser:"+passwd+"@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

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
  title: "/Jedi/i"
};

// Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
 if (err) throw err;
// Suoritetaan kysely collection-olion avulla
  collection
    .find(query)          // query muuttuja sisältää kyselyn
    .limit(5)             // rajoitetaan tulosjoukko 5:een
    .toArray(function(err, result) {  // Palautetaan tulokset JS-taulukkona
      if (err) throw err;
      console.log(result);            // Tulostetaan taulukko ruudulle
      client.close();                // Suljetaan yhteys
    });
});

```

Suorituksen jälkeen konsoliin tulostaa tietokannasta JSON-muotoista elokuvadataa.

```javascript
[
  {
    _id: 573a1397f29313caabce8cdb,
    plot: 'After rescuing Han Solo from the palace of Jabba the Hutt, the rebels attempt to destroy the second Death Star, while
Luke struggles to make Vader return from the dark side of the Force.',
    genres: [ 'Action', 'Adventure', 'Fantasy' ],
    runtime: 134,
    metacritic: 52,
    rated: 'PG',
    cast: [
      'Mark Hamill',
      'Harrison Ford',
      'Carrie Fisher',
      'Billy Dee Williams'
    ],
    poster: 'https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SY1000_SX677_AL_.jpg',
    title: 'Star Wars: Episode VI - Return of the Jedi',
    fullplot: 'Darth Vader and the Empire are building a new, indestructible Death Star. Meanwhile, Han Solo has been imprisoned, and Luke Skywalker has sent R2-D2 and C-3PO to try and free him. Princess Leia - disguised as a bounty hunter - and Chewbacca go along as well. The final battle takes place on the moon of Endor, with its natural inhabitants, the Ewoks, lending a hand to the Rebels. Will Darth Vader and the Dark Side overcome the Rebels and take over the universe?',
    languages: [ 'English' ],
    released: 1983-05-25T00:00:00.000Z,
    directors: [ 'Richard Marquand' ],
    writers: [
      'Lawrence Kasdan (screenplay)',
      'George Lucas (screenplay)',
      'George Lucas (story)'
    ],
    awards: {
      wins: 19,
      nominations: 15,
      text: 'Nominated for 4 Oscars. Another 15 wins & 15 nominations.'
    },
    lastupdated: '2015-09-07 00:05:08.857000000',
    year: 1983,
    imdb: { rating: 8.4, votes: 564790, id: 86190 },
    countries: [ 'USA' ],
    type: 'movie'
  }
]
```

### Datan lisääminen

Tiedon lisääminen toimii lähes samalla koodipohjalla. find\(\)-funktion sijaan tiedo lisäämiseen käytetään insertOne\(\) tai insertMany\(\) -funktioita. Niiden käyttö on verrattain yksinkertaista; molemmat saavat parametrina lisättävän tietoalkion. InsertMany\(\) ottaa vastaan parametrina taulukossa. 

![Kuva: InsertOne\(\)-funktion rakenne.](../.gitbook/assets/image%20%282%29.png)

Alla esimerkki uuden elokuvan lisäämisestä tietokantaan.

```javascript
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
// apuna esim. MondoDB Compass -työkalua
var query = {
  title: new RegExp("Mikan uusi")
};

// Uuden lisättävän tieoalkion kuvaus
var newMovie = {
  title: "Mikan uusi elokuva",
  year: "2020",
  imdbID: "12345678",
  type: "movie",
  poster: "https://m.media-amazon.com/images/M/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_SX300.jpg"
};

// Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
  if (err) throw err;
  
  // Suoritetaan lisäys collection-olion avulla
  collection.insertOne(newMovie, function(err, r) {
  // Tulostetaan konsoliin tieto montako alkiota on lisätty (1)
    console.log(r.insertedCount);
  });

// Tehdään perään vielä tietokantahaku, jotta nähdään lisäyksen menneen perille 
// Huomaa, että tietokantahaun ehdoksi on vaihdettu uuden lisätyn leffan nimi
  collection
    .find(query) // query muuttuja sisältää kyselyn
    .limit(5) // rajoitetaan tulosjoukko 5:een
    .toArray(function(err, result) {
      // Palautetaan tulokset JS-taulukkona
      if (err) throw err;
      console.log(result); // Tulostetaan taulukko ruudulle
      client.close(); // Suljetaan yhteys
    });
});
```

### Datan muokkaaminen

Tietoalkioden muokkaaminen tapahtuu updateOne\(\) tai updateMany\(\) -funktioiden avulla. Erona näissä on se, moneenko osumaan päivitys tehdään. Parametrina funktio saa hakuehdon, jolla päivitettävät alkiot valitaan sekä operaation, joka palautuneisiin riveihin kohdistetaan.

![Kuva: UpdateMany\(\)-funktion rakenne.](../.gitbook/assets/image%20%2863%29.png)

Alla esimerkkikoodi, joka päivittää halutun alkion arvoja tietokannassa.

```javascript
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
// apuna esim. MondoDB Compass -työkalua
var query = {
  title: new RegExp("Jedi")
};

// Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
  if (err) throw err;

  // Suoritetaan lisäys collection-olion avulla
  collection.updateMany(
  // Etistään leffan joiden nimessä sana Jedi. Asetetaan julkaisuvuodeksi 1956
    { title: new RegExp("Jedi") },
    { $set: { year: 1956 } },
       // funktio ajetaan kun tulokset valmistuvat, r = result, err = errors
      function(err, r) {
      // Tulostetaan konsoliin tieto montako alkiota on päivitetty
      console.log("Muutettiin rivejä: " + r.modifiedCount);
    }
  );
  
  // Tehdään perään vielä tietokantahaku, jotta nähdään lisäyksen menneen perille
  // Huomaa, että tietokantahaun ehdoksi on vaihdettu uuden lisätyn leffan nimi

  collection
    .find(query) // query muuttuja sisältää kyselyn
    .limit(5) // rajoitetaan tulosjoukko 5:een
    .toArray(function(err, result) {
      // Palautetaan tulokset JS-taulukkona
      if (err) throw err;
      console.log(result); // Tulostetaan taulukko ruudulle
      client.close(); // Suljetaan yhteys
    });
});

```

### Tietokantadatan esittäminen selaimessa

Edellä luotiin Node.js ohjelma, joka ottaa yhteyden tietokantaan ja tekee sinne kyselyitä. Tulokset on toistaiseksi kirjoitetu konsoliin komennolla console.log\(\). Käytännössä kehittäjä haluaa useimmiten esittää tulokset selaimessa. Katsotaan miten tällainen onnistuu.

Alla ohjelman rakenteen hahmottelua korkealla tasolla. Se koostuu seuraavista osista:

1. MondoDB:n yhteysparametrien määrittelyt
2. Yhteyden luonti tietokantaan
3. Yhteydenluontifunktion sisällä luodaan Expressin avulla web-palvelin
4. Web-palvelimeen luodaan reittejä, jotka tekevät tietokantahakuja 

Ohjelman kahdessa ensimmäisesä osassa määritellään tietokantayhteyden vaatimat parametrit ja luodaan tietokantayhteys:

```javascript
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

```

Kun yhteys on luotu, luodaan web-palvelin ja reitit:

```javascript
 // Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();

  //////////////////////////////////////////
  // Express - palvelimen luonti
  //////////////////////////////////////////

    // Luodaan reitit ja niiden toiminnallisuudet
    app.get("/", function(req, res) {
      res.send("Hello World!");
    });

    app.get("/leffat", (req, res) => {
      collection.find(query).toArray(function(err, results) {
        console.log(results);
        res.json(results);
      });
    });
   
// Web-palvelimen luonti Expressin avulla
app.listen(3000, function() {
  console.log("Kuunnellaan porttia.");
});
```

### Edelliset yhdistettynä toimivaksi ohjelmaksi 

Esimerkkiohjelma on rakennettu "Tietokantahaun tekeminen" -otsikon alla esitettyä koodia täydentämällä. Olen yrittänyt jaotella ohjelmalohkot kommenttien avulla, joista näkyy mihin toimintaan mikäkin lohko liittyy.

Ohjelman perusidea on se, että riveillä 11-38 luodaan tietokantayhteys Mongoon tavalliseen tapaan. Tietokantayhteyden parametrien määrittely vie suurimman osan koodiriveistä \(nämä voisi toki eriyttää omaan tiedostoonsa\). Tämän jälkeen riveillä 44-56 luodaan Expressin avulla web-palvelin ja sille muutama reitti. 

```javascript
////////////////////////////////////////////////////////////
// Express määrittelyt
// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();

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

  
    // Luodaan reitit ja niiden toiminnallisuudet
    app.get("/", function(req, res) {
      res.send("Hello World!");
    });

    app.get("/leffat", (req, res) => {
      collection.find(query).toArray(function(err, results) {
        console.log(results);
        res.json(results);
      });
    });
   // Web-palvelimen luonti Expressin avulla
  app.listen(3000, function () {
    console.log("Kuunnellaan porttia.");
  });
  ////////////////////////////////
}); // connect-metodin lopetus

```

Reitti "/leffat" tulostaa tietokantadatan raakamuodossa selaimeen.

![Selaimessa n&#xE4;kyv&#xE4; JSON-data.](../.gitbook/assets/image%20%2819%29.png)

### Datan parsiminen

JSON-muotoisen datan parsiminen onnistuu käymällä se silmukassa läpi ja rakentamalla sen ympärille esim. sopiva HTML-taulukko. Parsiminen voidaan tehdä suoraan reitin sisällä tai esimerkiksi omassa funktiossaan, joka palauttaa rakennetun HTML-koodin kutsujalleen.

Alla hieman muunneltu leffat-reitti, joka parsii tulokset ja lähettää HTML-muotoisen vastauksen selaimelle.

```javascript
    app.get("/leffat", (req, res) => {
      collection.find(query).toArray(function(err, results) {
        console.log(results);
        var html = parse(results);
        res.send(html);
      });
    });
```

Sitten vielä itse funktio, joka parsii tulosjoukon silmukassa, poimii sieltä kolme kenttää ja sijoittaa ne taulukon solujen \(TD\) sisälle. Elokuvan kuvasta rakennetaan IMG-elementti, jonka selain osaa ladata ja esittää.

```javascript
function parse(data) {
  var html = "<table border='1'>";
  for (var i = 0; i < data.length; i++) {
    html += `<tr>
                 <td>${data[i].title}</td>
                 <td>${data[i].year}</td>
                 <td><img src='${data[i].poster}' height='30%'></td>
             </tr>`;
  }
  html += "</table>";
  return html;
}
```

Ohjelman suoritus selaimessa näyttää seuraavalta: 

![](../.gitbook/assets/image%20%2860%29.png)

### 

### Tietokantadatan esittäminen EJS-templaten avulla

Mikäli sovelluksessa käytetään EJS-sivupohjia, voidaan tietokannasta palautunut raakadata ohjata suoraan res.render\(\) -funktiolle ja antaa sivupohjan hoitaa datan parsiminen ja esittäminen. Määritetään ensin ohjelman käyttöön sivupohjat sekä siihen liittyvät asetukset:

```javascript
// otetaan EJS käyttöön
app.set("view engine", "ejs");

// Tällä pakotetaan sivupohja tuottamaan sisennettyä, kaunista HTML:ää.
// Tuotantokäytössä asetus voi olla false jolloin sivujen koko pienenee hieman
app.locals.pretty = true;
```

Sitten määritellään EJS-template nimeltä leffat.ejs. Tämä sijoitetaan hakemistoon views/pages.

```javascript
<!-- Tiedoston nimi on leffat.ejs -->
<!DOCTYPE html>
<html>
  <body>
    <h1>Leffat</h1>
    <table border="1">
      <!-- luodaan silmukka joka käy läpi taulu-muuttujan sisällön -->
      <% for (var i=0; i < taulu.length; i++){ %>
      <tr>
        <td><%= taulu[i].title %></td>
        <td><%= taulu[i].year %></td>
        <td><img src='<%= taulu[i].poster %>'' height='30%'></td>
      </tr>
      <% } %>
    </table>
  </body>
</html>

```

Tämän jälkeen lisätään ohjelman reittiin res.render\(\) -funktio, joka lähettää tulosdatan sivupohjalle ja rakentaa HTML-esityksen siitä. Huomaa, että tulosdata sijoitetaan taulu -nimiseen muuttujaan, jonka lata sivupohja pääsee siihen käsiksi.

```javascript
  app.get("/leffat", (req, res) => {
      collection.find(query).toArray(function(err, results) {
        console.log(results);
        res.render("pages/leffat", { taulu: results });
      });
    });
```

### Lomakkeiden ja tietokannan yhteiskäyttö

### Optimointia ja koodin modularisointia

Koodirivien määrän kasvaessa ohjelmat saattavat alkaa näyttää sekavilta ja niiden ylläpitotyö vaikeutuu hankalan luettavuutensa johdosta. Tämän vuoksi koodin modularisointi eli jakaminen osiin saattaa alkaa näyttää houkuttelevalta. Näin itse pääohjelma saadaan siistittyä. Katsotaan tästä muutama esimerkki.

#### Funktiot

Yksi mahdollisuus on luoda tietokantaan liittyvät toiminnallisuudet omana funktionaan, jolloin niiden käyttö onnistuu näppärästi funktiokutsun getResults\(\) avulla. Funktioon voidaan välittää parametrina hakusana, jolloin haku on helposti muunnetavissa. Toisena parametrina määritellään anonyymi funktio joka suoritetaan kun haku on tehty.

```javascript
app.get("/leffat", (req, res) => {
    // Kutsutaan tietokantahakua getResults() -funktion kautta.
    // Välitetään ekana parametrina hakusana, toisena parametrina anonyymi funktio joka käsittele vastauksen
    var results = getResult("Star Wars", function(err, result) {
      console.log(result);
      res.render("pages/leffat", { taulu: result });
    });
  });
```

Tietokantaoperaatiot käsittelevä funktio getResults\(\) on määritelty alla. Ainoina uusina asioina on tietokantahaun hakusanan välittäminen parametrina, sekä rivillä 45 tapahtuva callback-funktion kutsu. Ideana siis on kutsua tulokset käsittelevää funktiota nimellä, kun haku on suoritettu.

```javascript
// query-parametri määrittele hakusanan, callback sisältää anonyymin funktion 
// tulosten käsittelyä varten, nyt sitä voidaan kutsua nimellä "callback"

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

```

Ohjelma kokonaisuudessaan alla. Siitä on poistettu osa kommentteja rivimäärän karsimiseksi. 

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();

// otetaan EJS käyttöön
app.set("view engine", "ejs");
app.locals.pretty = true;

// Express - palvelimen luonti

 

  app.get("/leffat", (req, res) => {
    // Kutsutaan tietokantahakua getResults() -funktion kautta.
    var results = getResult("Star Wars", function(err, result) {
      console.log(result);
      res.render("pages/leffat", { taulu: result });
    });
  });
 

////////////////////////////////

function getResult(query, callback) {
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
```

Selaimen tuottama tulos on alla. 

![](../.gitbook/assets/image%20%2831%29.png)

#### Moduulit

Funktio voidaan vielä viedä oman moduulin sisään, joka tallennetaan erilliseen tiedostoon. Alla esimerkki siitä. Omat moduulit luodaan alihakemistoon modules ja ne voidaan tuoda pääohjelman käyttöön require-funktiolla. Reitin sisällä moduulin sisällä olevaa funktiota voidaan kutsua mongo.getData\(\) -syntaksilla. 

```javascript
// Tuodaan oma funktio itse luodusta moduulista, .js päätettä ei tarvitse
var mongo = require("./modules/mongo");

...

app.get("/", function(req, res) {
  var result = mongo.getData(function(err, result) {
    //handle err, then you can render your view
    console.log(result);
    res.render("pages/index", { collection: result });
  });
});
```

Omat moduulit luodaan alihakemistoon modules. Tiedostoon määritellään ohjelmakoodia tavalliseen tapaan. Ne funktiot, jotka halutaan saattaa muiden kutsuttavaksi määritellään exports-määreellä. Alla luodaan siis julkinen getData\(\) -funktio, jota kutsumalla suoritetaan moduulin sisällä oleva getResult\(\) -metodi. 

```javascript
exports.getData = function getResult(callback) {

...

}
```

#### Reitit omaan tiedostoonsa

Kun ohjelman alkaa syntyä useita reittejä, voidaan nekin siivota omaan tiedostoonsa.

```javascript
// Load routes from a file
var routes = require("./routes/routes");
app.use("/", routes);
```

Tiedostossa reitit määritellään tavalliseen tapaansa:

```javascript
var express = require("express");
var movieCtrl = require("../movieCtrl");

var router = express.Router();

router.route("/").get(movieCtrl.getResults);
router.route("/allmovies").post(movieCtrl.getAll);
router.route("/selected").get(movieCtrl.getSelected);

module.exports = router;
```

Omaan tiedostoonsa voidaan määritellä myös ns. controlleri, johon kootaan reittien toiminnallisuudet.

```javascript
module.exports = {
  getResults: function(req, res) {
    //do something
  },
  getAll: function(req, res) {
    //do something
  },
  postSelected: function(req, res) {
    //do something
  }
};

```



 



