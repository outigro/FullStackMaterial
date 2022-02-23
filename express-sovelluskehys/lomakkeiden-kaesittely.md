# Lomakkeiden käsittely

### HTML-lomake

Allaoleva lomake sisältää kaksi tekstikenttää sekä napin. Lomakkeen määrittelemä HTML-koodi on listattuna kuvan alapuolella. Nappia painamalla lomake lähettää siihen syötetyt tiedot haluttuun reittiin palvelimelle.

![Kuva: HTML-lomake.](../.gitbook/assets/image%20%2817%29.png)

Lomakkeen tyylit on määritelty käyttäen Bootstrap-kirjastoa. Itse toiminnallisuus ei vaadi lukuisia Bootstrapin class-määreitä. Huomaa erityisesti FORM-tägin METHOD-attribuutti, joka on tyyppiä POST. Samoin ACTION-attribuutti, joka määrittelee mihin URL:n lomake lähettää POST-tyyppisen sivupyynnön.

```markup
<html>
<!-- BOOTSRAP -tyylien määrittely -->
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
    crossorigin="anonymous"
  />
  <!-- Tyylien määrittelyä -->
  <style>
    div {
      margin: 10px;
    }
    form {
      border: 1px solid lightgrey;
      padding: 10px;
    }
  </style>
  <body>
    <div>
    <!-- Huomaa, että lomakkeen metodi = POST -->
    <!-- action -määrittelee URL:n johon POST-tyyppinen pyyntö lähetetään -->
      <form method="POST" action="/kirjaudu">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <!-- Huomaa tekstikentän name-attribuutti -->
          <input
            type="email"
            class="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            name="email" 
          />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <!-- Huomaa tekstikentän name-attribuutti -->
           <input
            type="password"
            class="form-control"
            id="pass"
            placeholder="Password"
            name="pass"
          />
        </div>
        <!-- Buttonin type = submit, joka saa aikaan lomakkeen lähetyksen -->
        <button type="submit" id="button1" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
    
  
  </body>
</html>

```

### Lomakkeen käsittely palvelimella

Aiemmin luotiin web-palvelin, joka vastasi selaimen lähettämiin GET-tyyppisiin pyyntöihin -- huomaa "app.get\(\)" -niminen funktio koodissa. Lomakkeiden käsittelyä varten sovelluksen tulee kuitenkin pystyä reagoimaan myös POST-tyyppisiin HTTP-pyyntöihin, jotka välittävät lomakkeen tietoja edelleen. Tämä saadaan aikaiseksi luomalla sovellukseen reittejä app.post\(\)-funktion avulla.

Allaolevaan koodiin on lisätty yksi app.post\(\) -tyyppinen reitti nimeltä "/kirjaudu". Tätä reittiä ei saa suoritettua esim. selaimen tavanomaisella sivupyynnöllä, voit kokeilla.

Sen sijaan  web-palvelin suorittaa tämän koodilohkon selaimen lähettäessä POST-tyyppisen HTTP-pyynnön, jossa pyydetään reittiä "/kirjaudu". Huomaa myös, että sovelluksessa voisi olla myös toinen samanniminen, mutta eri tyyppinen reitti app.get\("/kirjaudu"\). Tämä suoritettaisiin tavanomaiset GET-tyyppisen sivupyynnön yhteydessä.

```javascript
// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();

// Jotta HTML-lomake voidaan tarjoilla suoraan selaimelle ilman erillistä reittiä, sallitaan expressin 
// Tarjoilla staattisia sisältöjä projektin hakemistosta
app.use(express.static("./"));

// Luodaan reitit ja niiden toiminnallisuudet
app.get("/", function(req, res) {
  res.send("Hello World!");
});

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {
 res.send("Lähetit lomakkeen!");
});

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function() {
  console.log("Example app listening on port 8081!");
});
```

### Lomakkeen tietojen lukeminen

Edellinen esimerkki ei vielä poiminut lomakkeen lähettämää dataa POST-pyynnöstä. Se saadaan aikaiseksi käyttämällä body-parser -moduulia. Kyseinen moduuli  täytyy taas asentaa pakettienhallintatyökalulla seuraavlla komennolla:

```javascript
> npm i body-parser
```

Body-parser moduuli tuodaan sovelluksen käyttöön require-komennolla. 

```javascript
// Otetaan body-parser -moduuli käyttöön
var bodyParser = require("body-parser");

var app = express();

// Otetaan se käyttöön app-nimisessä express-sovelluksessa
app.use(bodyParser.urlencoded({ extended: true }));

```

Kun bodyparser on käytössä, päästään POST-pyynnön mukana tulevia muuttujia tutkimaan req.body-muuttujan kautta. Muuttujan kentät saavat nimensä HTML-lomakkeen name-attribuutin kautta. Näinollen halutut tiedot löytyvät email ja pass -nimisten kenttien alta. Esimerkkisovelluksessa kirjoitan kaiken POST-datan konsoliin testaamista varten sekä lähetän selailmeen vastauksena tiedon kahden kentän sisällöstä.

```javascript
// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;
  res.send("Lähetit lomakkeen! Email: " + email + " Password: " + pass);
});
```

Konsoliin tulostuu tieto POST-pyynnön datasta.

![](../.gitbook/assets/image%20%2839%29.png)

Alla vielä ohjelma kokonaisuudessaan.

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

// Luodaan reitit ja niiden toiminnallisuudet
app.get("/", function(req, res) {
  res.send("Hello World!");
});

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;

  res.send("Lähetit lomakkeen! Email: " + email + " Password: " + pass);
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

### Selaimen uudelleenohjaus 

Ohjelmaa voisi kehitellä edelleen, esim. siten että mikäli tunnus ja salasana täsmäävät, käyttäjä ohjataan tiettyyn osoitteeseen. 

```javascript
// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;

// Jos tunnukset ovat oikeat, ohjataan käyttäjä uuteen reittiin
    if (email === "onni@sci.fi" && pass === "opiskelija") {
    res.redirect("/userpage");
  }
  
});

// Uusi reitti sisäänkirjautuneelle käyttäjälle.
app.get("/userpage", function(req, res) {
  res.send("You are now logged in!");
});
```

### Muutamia tietoturvanäkökulmia 

Esimerkissä tunnuksia verrataan "kovakoodattuihin" arvoihin mikä ei todellisuudessa olisi tietenkään turvallista tai edes järkevää. Käytännössä tunnusta ja salasanaa voitaisiin etsiä erillisellä tietokantahaulla palauttaa ohjelmalle tieto mikäli validi tunnus/salasana -yhdistelmä löytyi. Toinen vaihtoehto olisi hakea tunnuksia ulkoisesta .env-tiedostosta - tästä lisää seuraavassa luvussa.

Lisäksi onnistunut sisäänkirjautuminen loisi istunnon, jonka olemassaolo tarkistettaisiin aina kirjautumista vaativille sivuille siirryttäessä. Näinollen satunnainen surffailija ei pääsisi sisään kirjautumista vaativalle sivulle vaikka tietäisi sen nimen. Molempiin palattaneen myöhemmin.



