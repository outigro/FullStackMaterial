# Templatet eli sivupohjat

### Johdanto

Aloittelevakin koodari huomaa nopeasti, että HTML-tägien tuottaminen tulostamalla koodin seasta on epäkäytännöllistä ja hankalaa. Kokonaisten HTML-sivujen tarjoilu helpottaa asiaa hieman, mutta silloin haasteeksi muodostuu dynaamisen eli vaihtuvan sisällön tuominen tarjoiltavan sivun sisälle. Tämä ongelma saadaan taklattua sivupohjilla \(eng. template, template engine\). Sivupohjat ja niihin liittyvät "moottorit" ovat ohjelmointikielistä riippumattomia ja niitä voidaan käyttää oikeastaan missä hyvänsä ohjelmointikielessä.

Sivupohjien ideana on rakentaa sivupohja, jonka muuttuvat osat merkataan erityisillä tägeillä ja muuttujan nimillä. Selaimelle tarjoillaan sitten sivupohja sekä joukko muuttujia, joiden sisältö ripotellaan valmiiksi oikeisiin kohtiin. Näinollen sivun sisältöä voidaan päivittää dynaamisesti ohjelman kautta välittämällä sinne erilaisia muuttujia. Siivupohjiin voidaan liittää myös toiminnallista logiikkaa kuten ehto- ja toistorakenteita. Tunnettuja sivupohjamottoreita ovat mm. EJS, PUG ja Mustache.

### EJS-sivupohja

EJS-sivupohjien idea on ripotella HTML-sivujen sekaan ohjausmerkkejä &lt;%  %&gt; joiden sisälle voidaan kirjoittaa muuttujia tai toiminnallisuuksia. Muuttujat sivupohjamoottori korvaa sopivalla datalla ja toiminnallisuudet suoritetaan ennen sivun tarjoilemista käyttäjälle. Alla esimerkki EJS-sivupohjasta, sille välitetystä datasta sekä siitä tuotetusta HTML-koodista.

```javascript
<!--  Määritellään EJS sivupohja, jossa HTML-tägien välissä muuttujia -->
<h1>< %= title %> </h1>
<ul> 
    <% for (var i=0;  i < supplies.length; i++){ %>
        <li> <%= supplies[i] %> </li>
    <% } %>
 </ul>
 <%= img_tag('/img/maid.png') %>  
```

Sivupohjaa kutsuttaessa, sille tulee välittää muuttuja, joka pitää sisällään tarpeelliset tiedot sivupohjan kenttiä varten. Alla esimerkki JSON-muotoisesta oliosta:

```javascript
{ 
  title: 'Cleaning supplies', 
  supplies: ['mop', 'broom', 'duster'] 
  }
```

Sivupohjamoottorin läpi ajettuna EJS-määrittely tuottaisi allaolevan HTML:n selaimelle:

![](../.gitbook/assets/image%20%2834%29%20%283%29.png)

### Sivupohjamoottorin käyttöönotto

Sivupohjat saadaan käyttöön Express-sovelluksessa lataamalla ne verkosta ja tuomalla ne mukaan projektiin kuten muutkin moduulit. EJS-templaten asennus tapahtuu seuraavasti:

```bash
npm install –save ejs
```

Node-koodissa sivupohja otetaan käyttöön seuraavasti:

```bash
var express = require("express");
var app = express();

// otetaan EJS käyttöön
app.set("view engine", "ejs");

// Tällä pakotetaan sivupohja tuottamaan sisennettyä, kaunista HTML:ää. 
// Tuotantokäytössä asetus voi olla false jolloin sivujen koko pienenee hieman
app.locals.pretty = true;
```

### Reittien luominen ja sivupohjan kutsuminen

Tämän jälkeen palvelimelle luodaan reittejä, kuten tavallista. Uutena toimintona sivujen lähettämiseen selaimelle käytetään res.render\(\)-funktiota, joka lähettää sivut template-moottorille ennen niiden päätymistä loppukäyttäjälle selaimeen.

```bash
app.get("/", function(req, res) {
  res.render("pages/index");
});

```

Sivupohjille voidaan kutsuvaiheessa välittää muuttujia seuraavalla tapaa:

```bash
// Määritellään muuttuja
var tervehdys = { teksti: "Hoi Maailma" };

app.get("/tervehdys", function(req, res) {
   // välitetään muuttuja sivupohjalle nimeltä "terve.ejs"
    res.render("pages/terve", tervehdys);
});

```

### EJS-tiedostojen luominen

Sivupohjat tulee sijoittaa **views**-nimiseen alihakemistoon. Ao. kuvassa näkyy esimerkkirakenne tällä sivulla esitetyille demoille. Projektin juurihakemisto jossa Node.js-koodi sijaitsee on "WS4...". Sen alle on luotu views-alikansio, jonka alle on vielä luotu kansio pages. Pages-kansiossa on joukko .ejs-päätteisiä tiedostoja. Huomaa, että res.render\(\) -funktiossa annetaan käytettävän tiedoston polku ja nimi ilman ejs-päätettä.  

![](../.gitbook/assets/image%20%2867%29.png)

Itse EJS-sivupohja määriteltäisiin **terve.ejs -nimiseen tiedostoon** ao. koodin mukaisesti. 

```markup
<!-- Tiedoston nimi on terve.ejs -->
<!DOCTYPE html>
<html>
  <body>
    <h1><%= teksti %></h1>
  </body>
</html>
```

Tämän määrittelyn jälkeen palvelin näyttää käyttäjälle sivupohjan mukaisen HTML-sivun, jossa muuttuja teksti on korvattu sinne välitetyllä muuttajalla.

```javascript
<!DOCTYPE html>
<html>
  <body>
    <h1>Hoi Maailma</h1>
  </body>
</html>
```

### Lisää muuttujia

 Katsotaan esimerkki erilaisista muuttujista ja niiden käytöstä sivupohjien kanssa. Lisätään edelliseen Node-koodiin seuraavat reitit.

```javascript
var ostokset = { otsikko: "Ostoslista",  
                 taulu: ["banaania", "omenaa", "päärynää"] 
               };

app.get("/ostokset", function(req, res) {
  res.render("pages/ostokset", ostokset);
});

```

Luodaan EJS-sivupohja joka käsittelee sille välitetyn taulukon.

```javascript
<!-- Tiedoston nimi on ostokset.ejs -->
<!DOCTYPE html>
<html>
  <body>
    <h1><%= otsikko %></h1>
    <ul>
     <!-- luodaan silmukka joka käy läpi taulu-muuttujan sisällön -->
      <% for (var i=0; i < taulu.length; i++){ %>
      <li><%= taulu[i] %></li>
      <% } %>
    </ul>
  </body>
</html>

```

Selaimelle HTML-sivu näkyy seuraavanlaisena:

```javascript
<!DOCTYPE html>
<html>
  <body>
    <h1>Ostoslista</h1>
    <ul>
      <li>banaania</li>
      <li>omenaa</li>
      <li>päärynää</li>
    </ul>
  </body>
</html>
```

### Ehtolauseet

Sivupohjien sisälle voi tarpeen tullen rakentaa myös ehtolauseita. Alla esimerkki:

```javascript
// Passing an array as data
var moredate = [
  { name: "John", age: 25 },
  { name: "Mike", age: 42 },
  { name: "Samantha", age: 51 }
];
app.get("/users", function(req, res) {
  res.render("pages/users", { users: moredata });
});
```

EJS-sivupohjassa tehdään ehtolause, joka tulostaa taulukkoon rivin vain jos etunimi ei ole John. Tarpeen mukaan myös ikään perustuvia vertailuja olisi mahdollista tehdä.

```javascript
<!-- Tiedoston nimi on users.ejs -->
  <table>
      <% users.forEach(function(user){ %>
         <% if (user.name != "John") { %>
          <tr>
            <td><%= user.name %></td>
            <td><%= user.age %></td>
          </tr>
         <% } %>
     <% })%>
  </table>
```

Koodin tuottama HTML-sivu olisi seuraavanlainen.

```javascript
  <table>
      <tr>
        <td>Mike</td>
        <td>42</td>
     </tr>
      <tr>
        <td>Samantha</td>
        <td>51</td>
     </tr>
  </table>
```

### Esimerkki isommalla HTML-sivupohjalla

### Sivupohjan pilkkominen osiin: partials

Sivupohjat voidaan jakaa uudelleenkäytettäviin osiin, joita kutsutaan nimellä "partial". Ideana on koota näitä uudelleenkäytettäviä osia omaan hakemistoonsa views-alihakemiston alle ja tuoda niitä osaksi HTML-sivua &lt;%- include \( 'sivun nimi'\) %&gt; tägillä. Alla sivun esimerkkiprojektin rakenne kun siihen on lisätty views-hakemisto, sekä pages ja partials -alihakemistot.

![](../.gitbook/assets/image%20%2857%29.png)

Alla esimerkki sivusta, joka koostetaan käyttäen "partialseja".

```javascript
<!DOCTYPE html>
<html lang="en">
<head> 
     <!-- Tuodaan HEAD-tägin sisälle tiedoston /partials/head -sisältö -->
     <%- include('partials/head') %>
</head>
<body class="container">
    <header>
        <!-- Tuodaan HEADER-tägin sisälle tiedoston /partials/header -sisältö -->
      <%- include('partials/header') %>
    </header>
    <main>
        <div class="jumbotron">
            <h1><%= heading %> </h1>
            <p> <%= content %> </p>
        </div>
    </main>
    <footer>
        <!-- Tuodaan FOOTER-tägin sisälle tiedoston /partials/footer -sisältö -->
        <%- include('partials/footer') %>
    </footer>
</body>
</html>
```

Alla tiedoston /partials/head -sisältö:

```javascript
<!-- views/partials/head.ejs -->

<title>W3.CSS Sample Template</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Raleway"
  />
  <style>
    body, h1, h2, h3, h4, h5 { font-family: "Raleway", sans-serif;   }
  </style>

```

Ja vielä /partials/footer-tiedoston sisältö:

```javascript
¨<!-- views/partials/footer.ejs -->

<button class="w3-button w3-black w3-disabled w3-padding-large w3-margin-bottom">
      Previous
</button>
 <button class="w3-button w3-black w3-padding-large w3-margin-bottom">
  Next »
 </button>
  <p>
   Powered by
   <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a>
  </p>

```

### PUG-sivupohja

Toinen varsin suosittu sivupohjamoottori on PUG \(entinen Jade\). Se menee vielä pidemmälle koodarin työn helpottamisessa: sivupohjiin ei tarvitse tuottaa HTML-tägejä lainkaan. Ainoastaan tägien nimet riittävät. Allaolevassa kuvassa vasemmalla on PUG sivupohjan määrittely ja oikealla template-moottorin siitä tuottama HTML-koodi. 

![](../.gitbook/assets/image%20%284%29%20%281%29.png)

Vaikka PUG vähentää HTML-koodin kirjoittamista, niin se saattaa vaikeuttaa esim. sivupohjan tekemistä jollain muulla välineellä tai vaikkapa graafisen suunnittelijan toimesta. Tätä varten verkossa on toki saatavilla erilaisia automaattisia muuntimia kuten [HTML to PUG](https://html-to-pug.com/).

Kiinnostuneet voivat tutustua PUGin sielunelämään esim. [täällä](https://pugjs.org/api/getting-started.html). Myös [Mustache ](https://www.npmjs.com/package/mustache)on tiedostamisen arvoinen sivupohjakieli.

### 

