# Datan hakeminen verkosta

Aiemmin käsiteltiin JSON-muotoisen datan lukemista ja käsitellyä paikallisista tiedostoista. Käytännön sovelluksissa data luetaan kuitenkin useimmiten verkon yli. Käytännössä tämän voi tehdä monella eri tavoin, mutta tutustutaan yhteen tavanomaisimmista.

### Axios

Käytetään datan hakemiseen verkon ylitse Axios-nimistä kirjastoluokkaa. Se ei kuulu Node.js:n vakiokirjastoon, joten se täytyy asentaa komennolla:

```javascript
npm i axios
```

Kuten jo front-end -koodissa huomattiin, tulee hakuoperaatio toteuttaa asynkronisesti ettei vastauksen odottelu jumita muun ohjelman suoritusta \(vrt. AJAX\). Ao. esimerkkikoodissa luodaan uusi AJAX-pyyntö ja käytetään ES6:n tarjoamaa nuolisyntaksia sekä then-lohkoa.

```javascript
// Otetaan axios-moduuli käyttöön
var axios = require("axios");
// Luodaan AJAX-kysely ja lähetetään pyyntö
const promise = axios
 .get("http://www.omdbapi.com/?s=star+wars&apikey=cbbc6750")
 // Käsitellään vastaus kun se saapuu
  .then(response => {
    const data = response.data;
    console.log(data);
  });
// Tulostetaan konsoliin promise-olion tilatietoja AJAX-pyynnön käsittelyn aikana  
console.log(promise);
```

Ohjelma tulostaa haetun JSON-muotoisen leffadatan:

![Kuva: JSON-muotoinen leffadata tulostettuna konsoliin.](../.gitbook/assets/image%20%2854%29.png)

Lisätään ohjelmaan silmukka joka käy läpi tuloksena saadun taulukon. Jokaisesta taulukon alkiosta tulostetaan Title-kenttä.

```javascript
    // Tehdään silmukka joka käsittelee tulosjoukkona saadun tauluko
    for (var i = 0; i < movies.Search.length; i++) {
      console.log(movies.Search[i].Title);
    }
```

Ohjelma kokonaisuudessaan näyttää seuraavalta:

```javascript
var axios = require("axios");
const promise = axios
  .get("http://www.omdbapi.com/?s=star+wars&apikey=cbbc6750")
  .then((response) => {
    const movies = response.data;
    // Tehdään silmukka joka käsittelee tulosjoukkona saadun tauluko
    for (var i = 0; i < movies.Search.length; i++) {
      console.log(movies.Search[i].Title);
    }
  });
```

Ohjelman tulostus näyttää nyt kuvan mukaiselta:

![Kuva: Leffadatasta poimitut Title-kent&#xE4;t.](../.gitbook/assets/image%20%2851%29.png)

