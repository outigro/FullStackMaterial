# JSON-muotoisen datan käsittely

JSON-muotoisen datan käsittely Nodella on helppoa - koska kysessä JavaScriptin oma olio-tyyppi voidaan dataa käsitellä JavaScriptin omien funktioiden avulla.

### Tiedon lukeminen ja tulostaminen

Luodaan ensin komentorivipohjainen sovellus jossa luetaan JSON-muotoinen tiedosto ja käydään sen sisältämät tietoalkiot läpi. Tiedosto voidaan lukea sisään sellaisenaan require-funktion avulla. Tässä olisi toki mahdollista käyttää myös aiemmin esiteltyjä fs-kirjaston funktioita.

```javascript
// Luetaan JSON tiedosto sisään muuttujaan käyttäen require-komentoa
var json = require("./data.json");

// Tulostetaan koko muuttujan sisältö
console.log(json);
```

Kun ohjelma suoritetaan tulostuu ruudulle jotakuinkin seuraavaa:

![Kuva: JSON-olio tulostettuna konsoliin. Huoma hakasulkeet, eli data sis&#xE4;lt&#xE4;&#xE4; taulukon jonka alkioita oliot ovat.](../.gitbook/assets/image%20%2810%29.png)

Datasetistä voidaan poimia ja tulostella myös yksittäisiä taulukon alkioita tai yksittäisen olion kenttiä.

```javascript
// Luetaan JSON tiedosto sisään muuttujaan käyttäen require-komentoa
var json = require("./data.json");

// Tulostetaan JSON-datan sisältämän taulukon neljäs alkio 
console.log(json[3]);

// Tulostetaan kuudennen alkion sisältämän olion address-kentän sisältö
console.log(json[5].address);
```

Ajettuna koodi tulostaa konsoliin seuraavat tiedot:

![Kuva: Taulukon yhden alkion tiedot sek&#xE4; sen alla yhden olion address-kent&#xE4;n tiedot.](../.gitbook/assets/image%20%2843%29.png)

### Alkioiden poistaminen tai lisääminen taulukkoon

JavaScript tarjoaa useita funktiota taulukon elementtien käsittelyyn. Näistä ehkä näppärimpinä push\(\) ja unshift\(\) sekä pop\(\) ja splice\(\), joilla taulukosta voidaan poistaa ja siihen voidaan lisätä lisätä alkioita. Katso muutkin metodit esim. [täältä](https://www.w3schools.com/js/js_array_methods.asp). 

Täydennetään edellä luotua sovellusta luomalla uusi JavaScript-olio koodissa ja lisätään se JSON-muotoiseen taulukkoon. 

```javascript
// Esitellään uusi JS-olio
var newitem = {
  age: 65,
  eyeColor: "Brown",
  gender: "Male",
  email: "James@mi6.com",
  name: "James Bond",
};
// Lisätään olio taulukon loppuun push()-funktiolla
json.push(newitem);
```

Tämän jälkeen kirjoitetaan JS-muuttuja kaikkine tietoineen takaisin tiedostoon. Ennen kirjoitusoperaatiota muuttuja tulee muuttaa merkkijonomuotoon käyttäen JSON.stringify\(\) -funktiota. Esimerkissä käytetyt parametrit tekevät tulostuksesta kauniisti muotoillun. Ilman niitä kaikki data kirjoitetaan yhdelle riville.

```javascript
// Kirjoitetaan lopuksi tiedosto levylle JSON-muodossa, eli sellaisenaan
var data = JSON.stringify(json, "", 1); // Parametreilla "" ja 1 saadaan kaunis tulostus

// Kirjoitetaan lopuksi tiedosto levylle JSON-muodossa, eli sellaisenaan
fs.writeFileSync("./data.json", data);
```

Lopuksi koko ohjelma testattavaksi:

```javascript
var http = require("http");
var fs = require("fs");

// Luetaan JSON muotoinen tiedosto
var json = require("./data.json");

// Tulostetaan taulukokon koko
console.log("Taulukon koko: " + json.length);

// Esitellään uusi JS-olio
var newitem = {
  age: 65,
  eyeColor: "Brown",
  gender: "Male",
  email: "James@mi6.com",
  name: "James Bond",
};
// Lisätään olio taulukon loppuun push()-funktiolla
json.push(newitem);

// Lisätään olio taulukon alkuun unshift()-funktiolla
json.unshift(newitem);

// Tulostetaan taulukon koko
console.log("Taulukon koko: " + json.length);

// Poistetaan alkioita

json.pop(); // Poistaa taulukon viimeisen alkion
json.splice(); // Poistaa taulukon ekan alkion
json.splice (3,2); // Poistaa indeksistä 4 alkaen 2 alkiota

// Tulostetaan taulukon koko
console.log("Taulukon koko: " + json.length);

// Kirjoitetaan lopuksi tiedosto levylle JSON-muodossa, eli sellaisenaan
var data = JSON.stringify(json, "", 1); // Parametreilla "" ja 1 saadaan kaunis tulostus

// Kirjoitetaan lopuksi tiedosto levylle JSON-muodossa, eli sellaisenaan
fs.writeFileSync("./data.json", data);

```

