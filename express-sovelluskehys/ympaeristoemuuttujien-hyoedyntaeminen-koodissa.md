# Ympäristömuuttujien hyödyntäminen koodissa

## Yleistä

Kun laaditaan sovelluksia, jotka sisältävät "arkaluontoisia" tietoja kuten käyttäjätunnuksia ja salasanoja sovelluksen käyttämiin tietokantoihin, kannattaa nämä tiedostot tallentaa lähdekoodin ulkopuolelle. Tämän ansiosta lähdekoodin jakaminen verkossa tai paljastuminen vahingossa ei kuitenkaan vuoda salaisuuksia julkisiksi.

## Ympäristömuuttujat

Ympäristömuuttujia voidaan asettaa suoraan käyttöjärjestelmätasolla mutta tavanomaisempaa on luoda ns. **env-tiedosto** johon tarpeelliset muuttujat tallennetaan. Node-sovellus voi sitten lukea tiedot tuosta tiedostosta.

## Muuttujien lukeminen tiedostosta

Muuttujien lukemista varten voidaan käyttää sitä varten rakennettua moduulia nimeltä _dotenv._ Asennetaan ensin paketti npm:n avulla:

```text
npm i dotenv
```

Luodaan sitten tekstitiedosto nimeltään .env. Piste tiedoston edessä viittaa siihen, että se on Linux-pohjaisissa järjestelmissä "piilotettu" tiedosto joka ei näy tiedostolistauksessa ilman erityisvalitsimia.

Tiedosto sisältää arvo-avainpareja sekä \# - merkillä alkavia kommentteja:

```text
# Web-kirjautumisen tunnus
USERID=onni.opiskelija@sci.fi
# Web-kirjautumisen salasana
PASSWD=salainen321
# Tietokantayhteydet tunnarit
DB_HOST=localhost
DB_USER=root
DB_PASS=demo
```

Node.js sovelluksessa tiedosto luetaan sisään seuraavasti:

```javascript
require('dotenv').config();
```

Tämän jälkeen arkaluontoista dataa sisältäviin muuttujiin voidaan Node-koodissa viitata **process.env**- avainsanaa käyttäen seuraavasti:

```javascript
// Luetaan tiedoston sisältö ohjelmaan
require("dotenv").config();

// Tulostetaan tiedostoon asetetut muuttujat
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
```

Käyttöjärjestelmän asettamia ympäristömuuttujia voit tutkia laajemminkin tulostamalla process.env -muuttujan tiedot kokonaisuudessaan:

```javascript
// Tulostetaan kaikki käyttöjärjestelmän asettamat ympäristömuuttujat
console.log(process.env);
```

## Pari esimerkkiä

Esimerkiksi yhteys kuvitteelliseen tietokantaan .env-tiedoston muuttujia käyttäen voitaisiin määritellä näin:

```javascript
require('dotenv').config();
// Luodaan yhteys kuvitteelliseen tietokantaan 

const db = require('db')
db.connect({  
// Nämä tiedot on määritelty aiemmin .env-tiedostossa
    host: process.env.DB_HOST,  
    username: process.env.DB_USER,  
    password: process.env.DB_PASS
    });

```

Esimerkiksi aiemmin luomamme "kirjautumislomakkeen" if-lause, jossa varmistetaan oikeat tunnukset, voisi näyttää palvelimella .env-tiedostoa hyödyntäen seuraavalta:

```javascript
// Luetaan .env-tiedoston data
require('dotenv').config();

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {

... // luetaan lomakkeen data

// Jos tunnukset ovat oikeat, ohjataan käyttäjä uuteen reittiin
    if (email === process.env.USERID && 
        pass === process.env.PASSWD) 
            res.redirect("/userpage"); 
});
```

## Tietoturvanäkökulma ja.gitignore

Arkaluontoisen datan tallentaminen ohjelmakoodin ulkopuolelle luo lisäturvaa sovelluskehitykseen. On kuitenkin ensiarvoisen tärkeää pitää huoli siitä, että **.env-tiedostoa ei julkaista lähdekoodin mukana**. 

Tämän varmistetaan lisäämällä .env -tiedosto ns. gitignore-tiedostoon, joka jättää sen versionhallinan ulkopuolelle. Näinollen sitä ei myöskään julkaista GitHubiin tm. pilvipalveluihin push/sync-operaatioiden yhteydessä. 

Tiedostoon usein laitetaan myös hakemisto node\_modules, joka estää kolmannen osapuolten kirjastojen sisällyttämisen versionhallintaan. Näitä ei kannata jaella oman koodin mukana, koska lähdekoodin käyttäjä saa tarpeen mukaan asennettua moduulit npm:llä.

Tiedostossa .gitignore käytännössä listataan ne tiedostot ja hakemistot jotka jätetään huomioimatta. Se voisi näyttää vaikka seuraavalta: 

```javascript
node_modules
.env*
```



