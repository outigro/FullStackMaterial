---
description: JavaScriptin suoritus palvelimella.
---

# Node.js

## Yleistä

Perinteisesti JavaScriptia on käytetty siten, että JavaScript-koodi on ollut upotettuna [web-sivulle html](https://fi.wikipedia.org/wiki/Html)-koodiin ja se on suoritettu käyttäjän verkkoselaimessa. 

**Node.js** on [avoimen lähdekoodin](https://fi.wikipedia.org/wiki/Avoin_l%C3%A4hdekoodi) [alustariippumaton](https://fi.wikipedia.org/wiki/Alustariippumaton) ajoympäristö JavaScript-koodin suorittamiseen [palvelimella](https://fi.wikipedia.org/wiki/Palvelin). Se mahdollistaa koodin suorittamisen suoraan palvelimella ilman selainympäristöä. Tarpeen vaatiessa sovellus tulostaa käyttäjän selaimeen vastauksen, joka on tyypillisesti joko HTML-koodia tai esim. jokin tietokannasta haettu tulosjoukko raakadataa XML tai JSON -muodossa. Node.js pohjautuu [Google](https://fi.wikipedia.org/wiki/Google) Chromen V8 JavaScript-moottoriin. 

Node siis korvaa perinteisen web-palvelimen \(kuten Apache\) roolin palvelinsovellusten suorittamisessa. Noden voidaan ajatella olevan joko web-palvelin joka osaa suorittaa JavaScriptiä tai JavaScript-sovellus, joka osaa toimia web-palvelimena.

## Hyödyt uusi 

Palvelimella suoritettava Javascript-koodi mahdollistaa mm. sen, että Javascript-kehittäjät voivat työskennellä melko vaivattomasti myös palvelinpuolen sovellusten parissa perinteisen selainsovellusten ohella \(kieli säilyy samana\). Lisäksi selainpohjaisten JavaScript-sovellusten integroiminen osaksi back-end sovelluksia on usein helpompaa kun JavaScriptiä voidaan käyttää molempien koodauksessa.

Suurimpana ajurina JavaScriptin siirtämiseen palvelinpuolelle lienee ollut kuitenkin perinteisten web-palvelinten \(kuten Apache\) suorituskykyyn liittyvät haasteet. Node.js:n käyttämä asynkroninen, tapahtumapohjainen sovellusten suorituslogiikka on merkittävästi tehokkaampi suurilla käyttäjämäärillä.  Tästä lisää tuonnempana.

## Perusteita

Node.js ohjelmat kirjoitetaan JavaScriptillä, joten syntaksi ja peruslogiikka ovat sen kanssa identtiset. Node on tavallaan JavaScript-konsoli palvelinympäristössä, samaan tapaan kuin selaimesta löytyvä JS-konsoli. Palvelinympäristössä ei kuitenkaan ole selainikkunaa, joten esim. document-olioon ja DOM-puuhun liittyvät operaatiot eivät sellaisenaan onnistu.

Esimerkkinä yksinkertainen JS-ohjelma:

{% tabs %}
{% tab title="JavaScript" %}
```javascript
console.log("Hello World!");
```
{% endtab %}
{% endtabs %}

Tiedoston suorittaminen tapahtuu komennolla:

`node hello.js`

```text
Hello World!

Process exited with code: 0
```

Samalla tapaa mikä tahansa JS-koodi voidaan suorittaa palvelimella.

## Web palvelin Nodella

Node.js pohjainen sovellus saadaan keskustelemaan selaimen kanssa luomalla yksinkertainen sovellus, joka toimii web-palvelimena. Tällä tavoin selain voi kutsua sovellusta ja sovellus vastata taas selaimelle takaisin. Huomaa myös miten palvelimelta vaadittava teknologiapino yksinkertaistuu, kun erillistä web-palvelinta, joka suorittaa koodin ei tarvita \(vertaa esim. Apache-PHP\).

```javascript
var http = require("http");

//create a server object:
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello World!\n"); //write a response to the client
    response.end("This is the end"); //end the response
  })
  .listen(8081); //the server object listens on port 8080
```

## Nodemon

Jotta ohjelmakoodiin tehdyt muutokset tulevat voimaan, täytyy muuttunut koodi ajaa uudestaan node-kääntäjän läpi. Tämä on hankalaa erityisesti palvelinsovellusten kanssa, joissa ohjelman suoritus ei lopu vaan ohjelma jää odottelemaan yhteydenottoa.

Tätä varten löytyy sovellus nimeltä nodemon. Sen ideana on tarkkailla kooditiedostoa muutosten varalta, ja käynnistää sovellus uudestaan aina kun muutos havaitaan. Ohjelman saa asennettua komennolla:

```javascript
npm i nodemon
```

Sitä käytetään sen jälkeen node-komennon sijaan ohjelmia ajettaessa:

```javascript
nodemon palvelin.js
```

Tämän jälkeen ohjelma suoritetaan tavalliseen tapaan. Mikäli muutat koodia ja tallennat muutokset, havaitsee nodemon sen ja käynnistää muuttuneen sovelluksen uudestaan.



