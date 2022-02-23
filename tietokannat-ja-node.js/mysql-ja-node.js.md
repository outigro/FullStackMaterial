# MySQL ja Node.js

## Moduulin asennus

Perinteisten relaatiotietokantojen käyttö Nodella on melko suoriaviivaista. Ensin tulee asentaa moduuli, joka tarjoaa tietokantaoperaatiot ohjelman käyttöön:

```text
npm i mysql
```

Tämän jälkeen koodissa määritellään yhteysosoite sekä käyttäjätunnus ja salasana tietokantaan. Esimerkissä käytän paikalliselle koneelle asennettua MySQL-tietokantaa osana XAMP-asennusta. Näinollen yhteysosoite on localhost ja käyttäjätunnus root. Salasanaa ei ole asetettu.

 **HUOM. Tällaiset arvot ovat tyypillisiä paikallisessa kehitysympäristössä, mutta niitä ei tulisi viedä julkisesti saavutettavissa olevalle palvelimelle.** Lisäksi tunnukset voitaisiin lukea ulkoisesta ENV-tiedostosta, jota on käsitelty jo aiemmin

```javascript
Tuodaan mysql-funktiot ohjelman käyttöön
var mysql = require("mysql");

// Määritellään tietokannan yhteystiedot JSON-muodossa
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});
```

## Yhteyden luominen

Lopuksi luodaan yhteys tietokantaan käyttäen connect-funktiota. Tämä ohjelma ei vielä tee mitään, mutta onnistunut yhteydenluonti tuottaa konsoliin tulostuksen "Connected". Muussa tapauksessa konsoliin tulostetaan virheilmoitus.

```javascript
Tuodaan mysql-funktiot ohjelman käyttöön
var mysql = require("mysql");

// Määritellään tietokannan yhteystiedot JSON-muodossa
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});
// Luodaan yhteys tietokantaan
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
```

## Kyselyn tekeminen

Kyseitä voidaan tehdä query-funktion avulla. Esimerkeissä olen käyttänyt yritys-tietokantaa - sen sisällön löydät [SQL-muodossa täältä](https://github.com/mjstenbe/R0317-MEAN/blob/master/yritys.sql).

```javascript
Tuodaan mysql-funktiot ohjelman käyttöön
var mysql = require("mysql");

// Määritellään tietokannan yhteystiedot JSON-muodossa
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

// Luodaan yhteys tietokantaan
con.connect(function (err) {
  if (err) throw err;
  
  // Suoritetaan SQL-kysely
  con.query("SELECT * FROM henkilo", function (err, result, fields) {
    if (err) throw err;
    // Tulostetaan kaikki tulosdata
    console.log(result);
    // console.log(result.length);
    // Tulostetaan tulosjoukon viides alkio
    console.log(result[5]);
        // Tulostetaan tulosjoukon viides alkio ja siitä kenttä enimi
    console.log(result[5].enimi);
  });

// Tehdään toinen kysely, jossa WHERE-lohko mukana
  con.query(
    "SELECT * FROM henkilo WHERE kunta = 'Turku'",
    function (err, result) {
      if (err) throw err;
      console.log(result);
    }
  );
});
```

## Sisäänkirjautumisen toteuttaminen

Jatkokehitetään seuraavaksi jo aiemmin toteuttamaamme sisäänkirjautumissovellusta siten, että uuden käyttäjän tiedot tallentuvat tietokantaan ja sisäänkirjautuvan käyttäjän tiedot käydään varmistamassa sieltä.

### Tietokannan valmistelu

Luodaan ensin tietokantaan tietokanta "logindemo" ja taulu "users" jota ohjelma käyttää. Seuraava SQL-lause luo tietokannan ja sinne tarvittavat rakenteet. Tauluun luodaan 3 saraketta: userid, name ja password. Tässä vaiheessa salasana tallennetaan selväkielisenä. Salasanakentän pituus on valmiiksi 50 merkkiä - sitä tarvitaan myöhemmin salatun tiedon tallentamista varten.

```sql
CREATE DATABASE LOGINDEMO;
CREATE TABLE `logindemo`.`users` ( 
    `userid` VARCHAR(30) NOT NULL ,
    `name` VARCHAR(30),
    `password` VARCHAR(50) NOT NULL
    );
```

Luodaan tietokantaan testikäyttäjä kokeilua varten:

```sql
INSERT INTO `users` (`userid`, `name`, `password`) VALUES (
    'onni123@sci.fi', 
    'Onni Opiskelija', 
    'Salasana123'
    );
```

Tietokannasta löytyy tämän jälkeen seuraava rivi:

![](../.gitbook/assets/image%20%2861%29.png)

### Kyselyiden tekeminen

Ohjelmassa tarvitaan karkeasti kahdenlaisia kyselyitä: 1\) Käyttäjän olemassaolon tarkastaminen tietokannasta sekä 2\) Uuden käyttäjän lisääminen tietokantaan. Näistä jälkimmäisen toteuttava SQL-lause on esitelty jo edellä testikäyttäjän luomisen yhteydessä.

Olemassaolevaa käyttäjää haettaisiin tietokannasta ao. kyselyn avulla. Jos haku palauttaa täsmälleen yhden rivin, tiedetään että käyttäjä jonka tunnus ja salasana täsmäävät löytyvät järjestelmästä. 

Jos tietoja ei löydy, on joko tunnus tai salasana väärin tai käyttäjää ei ole järjestelmässä. Se mikä näistä aiheuttaa kirjautumisen epäonnistumisen jää vain järjestelmän tietoon - kirjautumista yrittävälle taholle tätä ei tietoturvasyistä kannata kertoa.

```sql
SELECT * FROM USERS WHERE userid = 'onni123@sci.fi' and password='Salasana123';
```

### Lomakedatan lukeminen 

Otetaan käyttöön jo aiemmin kehitelty sisäänkirjautumislomakkeen tarjoava koodi. Siellä tutkimme lomakkeen lähettämiä tietoja if-lauseen sisällä seuraavasti:

```javascript
// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;

  // Jos tunnukset ovat oikeat, ohjataan käyttäjä uuteen reittiin
  if (email === "onni@sci.fi" && pass === "opiskelija") {
    res.redirect("/userpage");
  }
});
```

Muutetaan koodia siten, että lomakkeelle syötettyjä tietoja yritetään etsiä tietokannasta. Ensin muodostetaan SQL-lause lomakkeen tiedoista:

```javascript
  var email = req.body.email;
  var pass = req.body.pass;
  var query = `SELECT * FROM users WHERE userid = '${email}' and password='${pass}';`;
```

Sitten käydään tekemässä tietokantahaku ja tutkitaan if-lauseella palautuiko sieltä rivejä näillä tunnuksilla. Jos rivejä on 1, tunnus löytyy järjestelmästä ja käyttäjä voidaan ohjata uudelle sivulle \(userpages\). Muutoin ohjataan käyttäjä takaisin lomakkeelle \(/\).

```javascript
con.connect(function (err) {
    if (err) throw err;
    con.query(query, function (err, result, fields) {
      // Tulostetaan konsoliin tulosrivit 
      console.log("Tulosrivien määrä: " + result.length);
      // Jos meni oikein, tuloksia on 1 ohjataan käyttäjä toiseen paikkaan
      if (result.length == 1) {
        res.redirect("/userpage");
        console.log("Tunnukset oikein!");
      } else {
        res.redirect("/");
        console.log("Väärät tunnukset tai käyttäjää ei löydy");
      }
    });
  });
```

Kokonaisuudessaan ohjelma vielä alla. Sen alkuun lisäsin mysql-moduulin tuontilause sekä tietokannan yhteystiedot. 

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
// Otetaan body-parser -moduuli käyttöön
var bodyParser = require("body-parser");

var app = express();

// Tarjoillaan staattisia sivuja tästä hakemistosta
app.use(express.static("./"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "logindemo",
});

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function (req, res) {
  var email = req.body.email;
  var pass = req.body.pass;
  var query = `SELECT * FROM users WHERE userid = '${email}' and password='${pass}';`;

// Luodaan tietokantayhteys
  con.connect(function (err) {
    con.query(query, function (err, result, fields) {
      if (err) {
        console.log("Tapahtui virhe!" + err);
      }
      console.log("Tulosrivien määrä: " + result.length);
      if (result.length == 1) {
        res.redirect("/userpage");
        console.log("Tunnukset oikein!");
      } else {
        res.redirect("/");
        console.log("Väärät tunnukset tai käyttäjää ei löydy");
      }
    });
  });
});
// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function (req, res) {
  res.send("You are now logged in!");
});

// Oletusreitti joka tarjoillaan, mikäli muihin ei päädytty.
app.get("*", function (req, res) {
  res.send("Cant find the requested page", 404);
});

// Web-palvelimen luonti Expressin avulla
app.listen(3000, function () {
  console.log("Listening to port 3000.");
});
```

## **Tietoturvahuomioita**

### **Salasanan tallentaminen salattuna: tietokantafunktiot**

**Oikeassa sovelluksessa salasanan tulisi olla aina tallennettu salatussa muodossa, esim. SHA2-funktion avulla. Näin esim. tietovuotojen sattuessa arkaluontoinen data ei ole heti kaikkien käytettävissä.** Syötettävät kentät voidaan salata joko sovellustasolla tai tietokannassa. ****

Molemmissa on puolensa: tietokannan hoitaessa salauksen säästyy koodaaja salauksen toteuttamiselta sekä sovellus salauksen aiheuttaman laskenna tuottamalta kuormalta \(joka voi olla joskus huomattava\). Sen sijaan sovellustasolla valitun salausmenetelmän saa valita vapaammin eikä tietokanta rajoita käytettäviä salausalgoritmeja.  Katsotaan ensin miten tiedto salataan tietokannan toimesta.

MySQL:ssä on sisäänrakennettuna joukko HASH-funktioita, joiden avulla tiedon salaus voidaan liittää osaksi SQL-lauseita. Esim. ylläolevaan INSERT-lauseeseen voitaisiin liittää SHA2-funktio salasanakentän turvaamiseksi. Tietokanta siis siis tallennettavan merkkijonon salauksen ennen tiedon tallentamista:

```sql
INSERT INTO `users` (`userid`, `name`, `password`) VALUES (
    'Seppo@sci.fi', 
    'Seppo Salattu', 
    SHA2('Salainen123', 256)
    );
```

Tietokannasta löytyy tämän jälkeen seuraava rivi, jossa salasanakenttään viety tieto on salattu SHA2-funktiolla:

![](../.gitbook/assets/image%20%2868%29.png)

Mikäli salasanat on suojattu HASH-funktiolla, tulee SELECT lauseessa annettu selväkielinen salasana ajaa saman SHA1-funktion läpi jotta vastaava salattu merkkijono löytyy tietokannasta:

```sql
SELECT * FROM USERS WHERE userid = 'Seppo@sci.fi' and password=SHA2('Salainen123', 256)
```

Korvaamalla ohjelman käyttämät SQL-komennot näillä, saataisiin sovellus salaaman password-kentän sisältö. **HUOM. Kaikkien käyttäjien salasanat tulee olla joko salattuja tai selväkielisiä -molempia ei voi käyttää**  **rinnakkain tietokannassa.** Eli jatkoa varten myös äsken tietokantaan viedyn Onni Opiskelijan salasana tulisi salata. Voit esim. poistaa koko rivin tietokannasta ja lisätä käyttäjän uudestaan tuolla SHA1-funktiolla höystettynä. 

### **Salasanan tallentaminen salattuna: sovellustason salaus**

Sovellustasolla toteutettuun salaukseen valitaan vähän järeämpi salausmenetelmä: esim. [bcrypt](https://www.npmjs.com/package/bcrypt). Sitä käytetään myös Linux-käyttöjärjestelmän salasanojen tallennuksen yhteydessä. Se on vahvempi kuin SHA ja satunnainen "suola" sekä raskas luontiprosessi tekevät siitä erittäin vastustuskykyisen erilaisille murtoyrityksille.

Muutokset ohjelmaan ovat melko pieniä: tuodaan mukaan bcrypt-moduuli ja käytetään sitä lomakkeelta luetun salasanan suojaamiseen. Tämä suojattu salasana tallennetaan tietokantaan kuten edelläkin.

```javascript
// Salausta varten
const bcrypt = require("bcrypt");
const saltRounds = 10;

...

// Kun lomakkeen tiedot on luettu, salataan ne
  var password = req.body.pass;
  var newpass = bcrypt.hashSync(password, saltRounds); 
```

Kun käyttäjä kirjautuu palveluun, haetaan tietokantaan tallennettu salasana ja verrataan sitä lomakkeelle syötettyyn salasanaan. Huomaa, että bcrypt-funktiota käytettäessä salasanojen verailu täytyy tehdä // käyttäen compareSync-funktiota:

```javascript
// HUOM. Haetaan käyttäjä pelkän nimen perusteella, salasanavertailu vasta myöhemmin
var query = `SELECT * FROM users WHERE userid = '${email}'; 

// Luodaan tietokantayhteys
  con.connect(function (err) {
    con.query(query, function (err, result, fields) {
      if (err) {
        console.log("Tapahtui virhe!" + err);
      }
      console.log("Tulosrivien määrä: " + result.length);
      if (result.length == 1) {
      
        // Verrataan käyttäjän kirjoittamaa selväkielistäsalasanaa tietokannasta palautuneeseen salattuun
     if (bcrypt.compareSync(password, result[0].password)) {
      // jos ok,  ohjataan käyttäjä kirjautuneiden alueelle
      console.log("Vertailu ok, salasanat samat.");
      res.redirect("/userpages");
      // Muuten heitetään herja
    } else res.send("Virheellinen tunnus/salasana!");
  });   
}); 
     
```

### **SQL-hyökkäysten estäminen** 

Tällaisenaan sovellus liittää lomakkeiden kenttiin syötetyn tekstin suoraan osaksi tietokannassa suoritettavia SQL-lauseita. Tämä altistaa tietokannan ns. SQL-injektioille. Käytännössä pahantahtoinen käyttäjä voisi syöttää SQL-komentoja kirjautumislomakkeelle, jotka oikein muotoiltuna suoritettaisiin suoraan tietokannassa. Tietojen kalastelun lisäksi esim. taulujen poistaminen saisi aikaan merkittävää haittaa.

Lomakkeilta luettu data tulisi siis aina puhdistaa haitallisista merkeistä ja/tai suoritettavasta koodista. Tähän on olemassa useampia tapoja.

Yksi tapa on "puhdistaa" kaikki lomakkeelta luettu data ajamalla se esim. mysql-kirjaston escape\(\) -funktion läpi. Myös omia funktioita kiellettyjen merkkien korvaamiseksi voi kirjoitella.

```javascript
email = mysql.escape(email);
pass = mysql.escape(pass);
```

Käytetympi tapa lienee käyttää ns. valmisteltuja lauseita \(prepared statements\), jossa SQL-lausetta ei rakenneta liittämällä siihen suoraan tekstiä, vaan käytetään SQL:n omia muuttujia. Tietokanta huolehtii tällöin myös siitä, että muuttujat on käsitelty vaarattomiksi:

```sql
SELECT * FROM users WHERE userid = ? and password=?
```

Muuttujat sijoitetaan kysymysmerkkien paikalle Node.js:n puolella query-funktiossa:

```javascript
 // Tehdään kysely käyttäen turvallisempaa prepared statementsia
 // Huomaa että query-funktio saa toisena parametrina taulukon [email, pass]
 // joka määrittele mitkä muuttujat kysymysmerkkien tilalle laitetaan
 
    con.query(query, [email, pass], function (err, result, fields) {
     if (err) {
        console.log("Tapahtui virhe!" + err);
      }
      console.log("Tulosrivien määrä: " + result.length);
    });
```



Alla päivitetty ohjelma kokonaisuudessaan:

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
// Otetaan body-parser -moduuli käyttöön
var bodyParser = require("body-parser");

var app = express();

// Tarjoillaan staattisia sivuja tästä hakemistosta
app.use(express.static("./"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "logindemo",
});

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function (req, res) {
  var email = req.body.email;
  var pass = req.body.pass;
  //var query = `SELECT * FROM users WHERE userid = '${email}' and password=SHA1('${pass}');`;

    var query = `SELECT * FROM users WHERE userid = ? and password=SHA1(?);`;
// Luodaan tietokantayhteys
  con.connect(function (err) {
    con.query(query, [email, pass], function (err, result, fields) {
      if (err) {
        console.log("Tapahtui virhe!" + err);
      }
      console.log("Tulosrivien määrä: " + result.length);
      if (result.length == 1) {
        res.redirect("/userpage");
        console.log("Tunnukset oikein!");
      } else {
        res.redirect("/");
        console.log("Väärät tunnukset tai käyttäjää ei löydy");
      }
    });
  });
});
// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function (req, res) {
  res.send("You are now logged in!");
});

// Oletusreitti joka tarjoillaan, mikäli muihin ei päädytty.
app.get("*", function (req, res) {
  res.send("Cant find the requested page", 404);
});

// Web-palvelimen luonti Expressin avulla
app.listen(3000, function () {
  console.log("Listening to port 3000.");
});
```

## Modularisointia

Koodi kasvaa melko nopeasti hallitsemattomaksi puuroksi. Sitä voidaan modularisoida esim. tekemällä operaatioista erillisiä funktioita ja tallentamalla funktiot omaan tiedostoonsa. Tällöinkin haasteeksi saattaa tulla samannimisten muuttujien ja funktioiden hallinta. Niitä JavaScript-sovelluksissa ratkotaan mouduuleilla. 

### Tietokantafunktiot omaan moduuliin

Nodessa erillisistä "vastuista" on tapana tehdä moduuleita ja tallentaa koodi omaan tiedostoonsa. Katsotaan tästä esimerkki. Siirretään ensin kaikki tietokannan käsittelyyn liittyvä koodi omaan tiedostoonsa nimeltä db.js. Moduulin sisälle luodaan anonyymifunktio, joka nimetään select-muuttujaksi ja exportataan se. Näin funktiota voidaan käyttää muualtakin.

```javascript
// db.js 
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "logindemo",
});

// Tehdään hakutoiminnosta oma funktio

exports.select = function (req, res, query) {

  var email = req.body.email;
  var pass = req.body.pass;
  
  con.connect(function (err) {
    con.query(query, [email, pass], function (err, result, fields) {
      if (err) {
        console.log("Tapahtui virhe!" + err);
      }
      console.log("Tulosrivien määrä: " + result.length);
      if (result.length == 1) {
        res.redirect("/userpage");
        console.log("Tunnukset oikein!");
      } else {
        res.redirect("/");
        console.log("Väärät tunnukset tai käyttäjää ei löydy");
      }
    });
  });
};
```

Tämän jälkeen itse palvelimen koodi muuttuu aika lyhyeksi. Ohjelmaan tuodaan mukaan äsken kirjoittamme moduuli db.js require-funktiolla, eli samalla tapaa kuin muutkin valmiskirjastot  

```javascript
var DB = require("./db.js");
```

Tämän jälkeen select -funktiota voidaan kutsua require-funktiossa esitellyn DB-muuttujan kautta.

```javascript
  DB.select(query);
```

Reitti joka käsittelee kirjautumisen muuttuu seuraavanlaiseksi:

```javascript
app.post("/kirjaudu", function (req, res) {
  var email = req.body.email;
  var pass = req.body.pass;
  //var query = `SELECT * FROM users WHERE userid = '${email}' and password='${pass}';`;
  var query = `SELECT * FROM users WHERE userid = ? and password=SHA1(?);`;
 // Kutsutaan DB-moduulin select -funktiota
   DB.select(req, res, query);
});
```

Palvelimen koodi kokonaisuudessaan:

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
// Otetaan body-parser -moduuli käyttöön
var bodyParser = require("body-parser");

var app = express();

// Tarjoillaan staattisia sivuja tästä hakemistosta
app.use(express.static("./"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// Tuodaan tietokantamoduuli ohjelmaan mukaan
var DB = require("./db.js");

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function (req, res) {
  var email = req.body.email;
  var pass = req.body.pass;
//  var query = `SELECT * FROM users WHERE userid = '${email}' and password='${pass}';`;
  var query = `SELECT * FROM users WHERE userid = ? and password=SHA1(?);`;
    DB.select(req, res, query);
});
// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function (req, res) {
  res.send("You are now logged in!");
});

// Oletusreitti joka tarjoillaan, mikäli muihin ei päädytty.
app.get("*", function (req, res) {
  res.send("Cant find the requested page", 404);
});

// Web-palvelimen luonti Expressin avulla
app.listen(3000, function () {
  console.log("Listening to port 3000.");
});

```

Oikeastaan koko muuttujien lukemisen ja query-muuttujan koostamisen voisi siirtää DB-moduuliin. Tämän jälkeen reittiin jää vain yksi komento. Koska parametri rakennetaan siellä, ei query -muuttujaa tarvitse enää välittää edelleen. Sen sijaan req ja res muuttujat tarvitaan jotta niihin voidaan kirjoittaa vastaus.

```javascript
app.post("/kirjaudu", function (req, res) {
  DB.select(req, res);
});
```

Alla palvelimen  koodi kokonaisuudessaan:

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
// Otetaan body-parser -moduuli käyttöön
var bodyParser = require("body-parser");

var app = express();

// Tarjoillaan staattisia sivuja tästä hakemistosta
app.use(express.static("./"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// Tietokantafunktiot käyttöön
var DB = require("./db.js");

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function (req, res) {
  DB.select(req, res);
});
// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function (req, res) {
  res.send("You are now logged in!");
});

// Oletusreitti joka tarjoillaan, mikäli muihin ei päädytty.
app.get("*", function (req, res) {
  res.send("Cant find the requested page", 404);
});

// Web-palvelimen luonti Expressin avulla
app.listen(3000, function () {
  console.log("Listening to port 3000.");
});

```

Tietokantamooduuli \(db.js\):

```javascript
// db.js 
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "logindemo",
});

// Tehdään hakutoiminnosta oma funktio

exports.select = function (req, res, query) {
  // Luetaan muuttujat lomakkeelta
  var email = req.body.email;
  var pass = req.body.pass;
 //var query = `SELECT * FROM users WHERE userid = '${email}' and password=SHA1('${pass}');`;

    var query = `SELECT * FROM users WHERE userid = ? and password=SHA1(?);`;
// Luodaan tietokantayhteys
  con.connect(function (err) {
    con.query(query, [email, pass], function (err, result, fields) {
      if (err) {
        console.log("Tapahtui virhe!" + err);
      }
      console.log("Tulosrivien määrä: " + result.length);
      if (result.length == 1) {
        res.redirect("/userpage");
        console.log("Tunnukset oikein!");
      } else {
        res.redirect("/");
        console.log("Väärät tunnukset tai käyttäjää ei löydy");
      }
    });
  });
};

```

Moduulitiedostot tallennetaan usein alihakemistoon nimeltä modules.



