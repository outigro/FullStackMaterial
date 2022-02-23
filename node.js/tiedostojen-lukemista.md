# Tiedostojen käsittely

Selainympäristössä JavaScriptillä ei ole mahdollista lukea tai kirjoittaa tiedostojärjestelmään. Palvelimalla ajettaessa tämä on kuitenkin mahdollista ja usein varsin tarpeellistakin erilaisten sovellusten toiminnan kannalta. Node.js tarjoaa joukon funktioita joilla tiedostojen ja hakemiston käsittely onnistuu. Funktiot on kuvattu[ Node.js:n API](https://nodejs.org/dist/latest-v12.x/docs/api/):ssa.

Tavanomaisimpia tiedostojen ja hakemistojen käsittelyyn liittyviä funktioita ovat:

* readdir, mkdir, rmdir
* readfile, writeFile, rename, unlink
* isFile, isDirectory

### Asynkroniset ja syknroniset operaatiot

Oletuksena Node.js funktiot ovat asynkronisia \("taustalla ajettavia"\). Haluttaessa kehittäjä voi kuitenkin käyttää funktioista myös synkronisia versioita \("suoritusta odottavaa"\). Näinollen tiedostojen ja hakemistojen käsittelyyn liittyvät vastaavat synkroniset funktiot olisivat: _readFileSync, writeFileSync, readDirSync_ jne. Funktion nimen perään liitettävä sync-sana merkitsee synkronista operaatiota. Asynkronisilla operaatioilla saavutetaan merkittävästi parempi suorituskyky kun sovellus voi odottamisen aikana suorittaa koodia edelleen.

**Jokaisesta tiedostoja käsittelevästä funktiosta on Nodessa siis olemassa kaksi versiota: synkroninen ja asynkroninen versio**. Toisen suoritusta siis jäädään odottamaan \(synkroninen\) ja toinen jätetään käyttöjärjestelmän suoritukseen ohjelman edetessä seuraavaan operaatioon \(asynkroninen\). Eli kun esim. käyttöjärjestelmä saa luku/kirjoitusoperaation valmiiksi, se palauttaa tuloksen ohjelmalle joka jatkaa kyseistä operaatiota siitä mihin se jäi. Kysessä on jo AJAXin yhteydessä tutuksi tullut konsepti; selain jatkaa toimintaansa sillä välin, kun AJAX-kutsu hakee palvelimelta dataa. 

## Tiedoston lukemista \(synkronisesti\)

Tiedostojen lukeminen ja tulostaminen ruudulle tapahtuisi seuraavasti. Huomaa erityisesti require-lause koodin alussa. Sen avulla filesystem-niminen moduuli, joka sisältää tiedostojen käsittelyyn tarvittavat funktiot, otetaan ohjelman käyttöön.

```javascript
// Tuodaan filesystem-moduuli ohjelmaan
var fs = require("fs");

// Luetaan tiedoston sisältö muuttujiin
var data = fs.readFileSync("example.txt");
 
// Tulostetaan tiedoston sisältö ruudulle
console.log("Luettu tiedostosta:");
console.log(data.toString());
```

## Tiedoston kirjoittamista \(synkronisesti\)

Vastaavasti tiedostojen kirjoittaminen onnistuu fileWriteSync\(\) -funktion avulla. Ohjelman suorituksen jälkeen ohjelmakoodin sisältämään hakemistoon on ilmestynyt tekstitiedosto, joka sisältää ohjelmassa määritellyt tekstit.

```javascript
// Tuodaan filesystem-moduuli ohjelmaan
var fs = require("fs");

var data = "Tekstiä tiedostossa!";

// Kirjoitetaan data-muuttuja tiedostoon
fs.writeFileSync('uusiFile.txt', data);

// Lisätään tiedoston perään tekstiä
fs.appendFileSync('uusiFile.txt', "Lisää tekstiä!");
```

## Virheiden nappaaminen

Virheen sattuessa ohjelman suoritus loppuu, mikäli virhetilannetta ei käsitellä asianmukaisesti. Esim. olemattoman tiedoston lukuyritys näyttää ilman virheenkäsittelyä seuraavalta:

![Virheilmoitus kun tiedostoa ei l&#xF6;ydy.](../.gitbook/assets/image%20%2811%29.png)

Try-catch -rakenne mahdollistaa virhetilanteiden hallitun käsittelyn. Ideana on sijoittaa virhealtis koodi try-catch -lohkon sisään, minkä jälkeen määritellään miten virhetilanteen sattuessa toimitaan.

```javascript
// Tuodaan filesystem-moduuli ohjelmaan
var fs = require("fs");

// Aloitetaan virhealtis ohjelmalohko
try{

// Luetaan tiedoston sisältö muuttujiin
var data = fs.readFileSync("olematon.txt");

// Tulostetaan tiedoston sisältö ruudulle
console.log("Luettu tiedostosta:");
console.log(data.toString());

// Käsitellään virhe, jos sellainen tapahtuu
} catch (err){
  console.log("Tuli virhe "+err);
}
```

Ylläolevan koodin suorittaminen tuottaa seuraavanlaisen tulostuksen:

![Virheilmoitus try-catch -lohkossa k&#xE4;siteltyn&#xE4;.](../.gitbook/assets/image%20%2848%29.png)

## Tiedostojen käsittely \(asynkronisesti\)

Tiedostojen käsittely asynkronisesti perustuu AJAX:in tapaan ns. callback-funktioihin. Ideana on, että esim. readFile\(\) -funktio lähettää käyttöjärjestelmälle pyynnön tiedoston sisällön lukemisesta. Sillä välin kun tuloksia odotellaan \(käyttöjärjestelmä suorittaa tiedoston lukemispyyntöä\), jatkaa Node.js koodirivien suorittamista ohjelmassa. 

Kun käyttöjärjestelmä saa tiedoston sisällön luettua se kutsuu readFile\(\) -funktiolle määriteltyä anonyymia callback-funktiota. Tätä funktiota käytetään tulosten käsittelyyn. Funktio saa parametrina muuttujat err ja data, jotka sisältävät lukuoperaation palauttaman datan \(muuttuja nimeltä data\) tai vaihtoehtoisesti tiedot tapahtuneista virheistä \(muuttuja nimeltä err\).

Allaoleva esimerkkisovellus lukee tiedoston ja tulostaa sen ruudulle asynkronista readFile\(\) -funktiota käyttäen.

```javascript
var fs = require('fs')

var data = fs.readFile('example.txt', 
  function (err, data) {
    if (err) {
      console.log('Tapahtui virhe!')
  }
  console.log('Luettu tiedosto:')
  console.log(data.toString())
})
```

![Suorituksen tulos konsolissa.](../.gitbook/assets/image%20%2842%29.png)

Suoritus näyttää ihan samanlaiselta kuin synkroninenkin operaatio. Tämä johtuu siitä, että ohjelmassa ei ole muita operaatioita. Lisätään koodiin yksi silmukka. 

```javascript
var fs = require('fs')

console.log('Aloitetaan lukuoperaatio.')
var data = fs.readFile('example.txt', function (err, data) {
  if (err) {
    console.log('Tapahtui virhe!')
  }
  console.log('Luettu tiedosto:')
  console.log(data.toString())
})

for (var i = 0; i < 10; i++) {
  console.log('Tulostetaan rivi tiedoston sisältöä odotellessa..' + i)
}

```

Kun ohjelma suoritetaan sen tulostus saattaa näyttää erikoiselta. Huomaa, että ensin suoritetaan rivillä 3 oleva tulostuslause, sitten readFile\(\) funktio, joka jää kuitenkin asynkronisesti ikäänkuin "taustalle" odottelemaan käyttöjärjestelmältä tiedoston sisällön saapumista. Tämän odotteluajan Node käyttää hyväkseen suorittamalla koodirivejä edelleen. Näinollen rivellä 12-13 oleva silmukka suoritetaan ja ruudulle tulostuu sen sisällä olevat tulostusoperaatiot. Vasta kun silmukka päättyy, palautuu readFile\(\) funktio suoritukseen, ja sen sisältö tulostetaan ruudulle.

![Ohjelman suoritus.](../.gitbook/assets/image%20%2815%29.png)

Toisinaan Node.js ohjelmien suoritus siis näyttää siltä, että eri ohjelman osat Asynkronisen toiminnan ymmärtäminen on tärkeää

