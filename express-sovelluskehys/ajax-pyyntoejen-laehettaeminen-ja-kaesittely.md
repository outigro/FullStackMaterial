# AJAX-pyyntöjen lähettäminen ja käsittely

Aiemmin kävimme läpi lomakkeen lähettämän datan  käsittelyä Nodella. Yhä useammin modernit web-sovellukset lähettävät dataa AJAXin avulla. Katsotaan seuraavaksi miten kirjautumislomakkeen data lähetetään ja käsitellään tällaisessa tapauksessa.

### Muutoksia lomakkeeseen

Alla on lomakkeen määrittelevä HTML-koodi. Se on lähes identtinen edellisen luvun kanssa. Merkittävin  muutos on siinä, että lomakkeen nappi on muutettu tyypistä "Submit" tavalliseksi "button" -tyyppiseksi napiksi. Tämä aiheuttaa sen, että napin painallus ei käske selainta lähettmäänä lomaketta edelleen. Sen sijaan käsitellään napin painallus JavaScriptin avulla. 

```markup
 <button type="button" id="button1" class="btn btn-primary">
```

Tällä kertaa luodaan siis JavaScriptin avulla AJAX-olio, joka lähettää lomakkeen tiedot edelleen palvelimelle. 

Lisäksi olen lisännyt  HTML-sivulle lomakkeen alle tyhjän DIV-lohkon nimeltä "status". Ideana on, että kun AJAX pyyntö palauttaa palvelimen vastauksen, tuodaan tämä vastaus näkyviin kyseiseen kenttään.

```markup
    <!-- Tähän kenttään palautetaan AJAXin vastaus -->
    <div id="status"></div>
```

Alla vielä koko HTML-koodi.

```markup
<html>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
    crossorigin="anonymous"
  />
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
      <form method="POST" action="/kirjaudu">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
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
          <input
            type="password"
            class="form-control"
            id="pass"
            placeholder="Password"
            name="pass"
          />
        </div>

        <button type="button" id="button1" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
    <!-- Tähän kenttään palautetaan AJAXin vastaus -->
    <div id="status"></div>

<!-- Tästä alkaa JavaScript -koodit -->

   
  </body>
</html>

```

### Kuuntelijoiden lisääminen ja kenttien arvot

Jotta lomake saadaan lähettämään data edelleen, tulee sivulle lisätä JavaScript-koodia. Koodit voi joko lisätä sivulle script-tägin sisällä tai linkittää osaksi sitä erillisestä JS-tiedostosta. Selkeyden vuoksi lisään koodin nyt osaksi HTML-sivua, riviltä 50 alkaen.

Lomakkeen nappiin voidaan lisätä JS-toiminnallisuutta kahdella tapaa; joko lisäämällä button tägiin onclick -kuuntelija, tai lisäämällä kyseinen kuuntelija dynaamisesti jälkeenpäin. Käytän tässä selvyyden vuoksi jälkimmäistä tapaa.

Lisätään sivulle ensin window.onload -kuuntelija. Tämä seuraa koska selain on ladannut sivun kokonaan valmiiksi ja suorittaa koodin vasta sitten. Tämä on tärkeää koska kuuntelijoiden lisääminen ei onnistu mikäli sivu on vain osittain ladattu.

Kun sivu on ladattu, koodi lisää onclick-kuuntelijan nappiin. Napin painallus aiheuttaa JavaScript-koodin suorittamisen, joka hakee kenttien sisällöt email ja pass -nimisiin muuttujiin talteen. Testausta varten kirjoitan muuttujien sisällön myös konsoliin.

```javascript
      // Varmistetaan että sivu on ladattu kokonaan ennenkuin lisäillään kuuntelijoita
      window.onload = event => {
        //   console.log("page is fully loaded");

        var nappi = document.getElementById("button1");

        // Lisätään nappiin kuuntelija, joka hakee kenttien tiedot klikattaessa
        nappi.addEventListener("click", () => {
          var email = document.getElementById("email").value;
          var pass = document.getElementById("pass").value;
          console.log(email, pass);

 
```

### AJAX-pyynnön luominen

Kun kenttien arvot on haettu, on aika luoda AJAX-pyyntö ja lähettää data edelleen palvelimelle. AJAX-pyynnön palautuessa koodilla 200 \(=OK\) sen sisältö päivitetään aiemmin luotuun "status" -nimiseen div-lohkoon.



```javascript
 // Luodaan AJAX olio joka palauttaa vastauksensa status-kenttään     
         var xmlhttp = new XMLHttpRequest();
         xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            // Vastauksena saatu data tuodaan status-kenttään näkyviin
              document.getElementById("status").innerHTML = this.responseText;
              console.log(this.responseText);
            }
          };
```

Lähetettävä pyyntö määritellään POST-tyyppiseksi ja kohdeosoitteeksi "/kirjaudu". 

```javascript
 // Lähetetään AJAX pyyntö, tyyppiä POST osoitteeseen /kirjaudu
          xmlhttp.open("POST", "/kirjaudu", true);
```

Huomionarvoista on myös se, miten data liitetään osaksi AJAX-pyyntöä. Ensin määritellään setRequestHeader\(\) -funktiolla että pyyntö sisältää lomakedataa. Send\(\) -funktiossa muuttujien nimet ja arvot välitetään avain-arvo -pareina ja & -merkillä eroteltuna eteenpäin.

```javascript
    // Lähetetään AJAX pyyntö, tyyppiä POST osoitteeseen /kirjaudu
          xmlhttp.open("POST", "/kirjaudu", true);
          // Liitetään AJAX pyyntöön lomakkeen kenttien datat
          xmlhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          xmlhttp.send("email=" + email + "&pass=" + pass);
        });
```

### Vaihtoehtoinen tapa lähettää parametrit

Edellä lomakkeen data lähetettiin URL:n mukana avain-arvo -pareina palvelimelle. Toinen vaihtoehto on koodata lomakkeen kentät JSON-olioksi ja lähettää ne sitten edelleen palvelimelle. Tämä saattaisi olle kannattavampaa erityisesti jos välitettävää dataa on paljon. Tämä tapahtuu asettamalla ensin AJAX-pyynnön Content-type arvoon "application/json". Luotu JSON olio muutetaan tekstimuotoon JSON.stringify\(\) -funktiolla ennen sen lähettämistä.

```javascript
      xmlhttp.open("POST", "/kirjaudu", true);
      xmlhttp.setRequestHeader("Content-type", "application/json");
    
        // Kootaan kenttien tiedot data-muuttujaan
          var data = {
            email: email,
            pass: pass
          };
          // Lähetetään data-muuttuja merkkijonona palvelimelle
          xmlhttp.send(JSON.stringify(data));
```

Mikäli data lähetetään JSON-muodossa, palvelimen Express-koodiin täytyy lisätä seraava rivi jotta sen vastaanotto onnistuu:

```javascript
// Lomakkeen käsittelyä varten
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
```

### Lopullinen koodi

Alla vielä JavaScript koodi kokonaisuudessaan.

```markup
<!-- Tästä alkaa JavaScript -koodit -->

    <script>
      // Varmistetaan että sivu on ladattu kokonaan ennenkuin lisäillään kuuntelijoita
      window.onload = event => {
        //   console.log("page is fully loaded");

        var nappi = document.getElementById("button1");

        // Lisätään nappiin kuuntelija, joka hakee kenttien tiedot klikattaessa
        nappi.addEventListener("click", () => {
          var email = document.getElementById("email").value;
          var pass = document.getElementById("pass").value;
          console.log(email, pass);

 
        // Luodaan AJAX olio joka palauttaa vastauksensa status-kenttään     
         var xmlhttp = new XMLHttpRequest();
         xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              document.getElementById("status").innerHTML = this.responseText;
              console.log(this.responseText);
            }
          };
          
        // Lähetetään AJAX pyyntö, tyyppiä POST osoitteeseen /kirjaudu
          xmlhttp.open("POST", "/kirjaudu", true);
          // Liitetään AJAX pyyntöön lomakkeen kenttien datat
          xmlhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          xmlhttp.send("email=" + email + "&pass=" + pass);
        });
      };
    </script>
```

### AJAX-pyynnön vastaanottaminen Nodessa

Node-palvelimella AJAX pyynnön käsittely ei juuri eroa tavanomaisesta POST-tyyppisetä HTTP-pyynnöstä. Muuttujien arvot saadaan esiin samaan tapaan kuin tavanomaisessakin pyynnössä. 

```javascript
// POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;

  res.send("Lähetit lomakkeen! Email: " + email + " Password: " + pass);
});
```

Palvelimen lähettämä vastaus välitetään AJAX-olion reponse-kentässä takaisin selaimelle. Selaimessa JavaScript-koodi puolestaan asettaa sen näkyviin status-nimiseen div-lohkoon.

![Kuva: Palvelimen vastaus p&#xE4;ivitet&#xE4;&#xE4;n HTML-sivun status-lohkoon.](../.gitbook/assets/image%20%2818%29.png)

Selaimista löytyvien kehittäjän työkalujen \(F12\) avulla voi olla mielenkiintoista seurata AJAX-pyynnön sielunelämää. Työkaluista tulee valita aktiiviseksi "Network" -välilehti.

![Kuva: Kehitt&#xE4;j&#xE4;n ty&#xF6;kalut Chromessa.](../.gitbook/assets/image%20%2822%29.png)

Headers-välilehden alta löytyvät sekä lähetetty data että saapuneen vastauksen sisältö.

![Kuva: AJAX-pyyn&#xF6;n mukana l&#xE4;hetetty data.](../.gitbook/assets/image%20%2836%29.png)

![Kuva: AJAX-pyynn&#xF6;n palauttama vastaus.](../.gitbook/assets/image%20%2820%29.png)

Koko HTML-sivu JavaScript-koodin kera löytyy vielä alta.

```markup
<html>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
    crossorigin="anonymous"
  />
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
      <form method="POST" action="/kirjaudu">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
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
          <input
            type="password"
            class="form-control"
            id="pass"
            placeholder="Password"
            name="pass"
          />
        </div>

        <button type="button" id="button1" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
    <div id="status"></div>

    <script>
      // Varmistetaan että sivu on ladattu kokonaan ennenkuin lisäillään kuuntelijoita
      window.onload = event => {
        //   console.log("page is fully loaded");

        var nappi = document.getElementById("button1");

        nappi.addEventListener("click", () => {
          var email = document.getElementById("email").value;
          var pass = document.getElementById("pass").value;
          //alert(email);
          console.log(email, pass);

  // Luodaan AJAX olio joka palauttaa vastauksensa status-kenttään 
  
          var xmlhttp = new XMLHttpRequest();

          xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              document.getElementById("status").innerHTML = this.responseText;
              console.log(this.responseText);
            }
          };
 // Lähetetään AJAX pyyntö, tyyppiä POST osoitteeseen /kirjaudu
 
          xmlhttp.open("POST", "/kirjaudu", true);
          // This is for the form data
          xmlhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          xmlhttp.send("email=" + email + "&pass=" + pass);
        });
      };
    </script>
  </body>
</html>

```

### Sivun edelleenohjaus AJAXin kanssa

Mikäli haluaisimme uudelleenohjata validin käyttäjän toiseen osoitteeseen, AJAX tuo pienen lisämutkan matkaan. Palvelimelta käsin ei voi uudelleenohjata AJAX-pyynnön kautta tehtyä sivua. Palvelinhan ainoastaan palauttaa dataa sivulle. Sen sijaan voimme palauttaa selaimelle tilakoodin, jonka perusteella selain voi itse tehdä edelleenohjauksen tarvittavalle sivulle.

Ao. koodissa onnistunut kirjautuminen lähettää AJAXin kautta vastauksen selaimelle tilakoodilla 301 \(=uudelleenohjaus\). 

```javascript
// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.pass;
  // Tutkitaan käyttäjän syöttämiä arvoja
  if (email === "onni@sci.fi" && pass === "opiskelija") {
        // Kun arvot ovat oikeat, viestitään siitä selaimelle tilakoodilla
        res.send("Success", 301);
        // Muutoin palautetaan toisenlainen tilakoodi / viesti
  } else res.send("Failed login", 200);

});
```

Uudelleenohjaus voidaan toteuttaa selaimen JavaScriptissä. AJAX pyynnön palautuessa takaisin tutkitaan sen sisältöä ja esim. status-kentän arvoa. Palvelimelta voimme palauttaa onnistuneen kirjautumisen yhteydessä HTTP statuskoodin 301 \(=uudelleenohjaus\). Tämän havaitessaan selain voi ohjata käyttäjän uuteen osoittesseen, tässä tapauksessa sivulle "/userpage".

```javascript
  xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              document.getElementById("status").innerHTML = this.responseText;
              console.log(this.responseText);
              
              // Tutkitaan tilakoodia 301
            } else if (this.readyState == 4 && this.status == 301) {
            // Ohjataaan käyttäjä uudelle sivulle
              location.replace("/userpage");
            }
          };
```

###  jQueryn käyttöönotto

Edellä käytettiin JavaScriptin "natiivifunktioita". Katsotaan vielä miten näppärästi homma hoituisi jQuery-kirjaston avulla. Bootstrap-sovelluskehyksen mukana tulee käytännössä jQueryn kevennetty versio, ns. jQuery Slim. Tässä paketissa jQuerystä on karsittu pois efektit ja AJAXiin liittyvä toiminnallisuus. Ajatuksena on, että näihin voidaan käyttää siten myös muita kirjastoja. DOM-skriptaukseen tarvittava kalusto on edelleen tallella. 

```markup
    <script
      src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
      integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
      crossorigin="anonymous"
    ></script>

```

Täyden version käyttöönotto onnistuu kuitenkin kevyellä muutoksella Bootstrapin script-tägiin. Käytännössä _jquery-x.x.x.slim.min.js_ -nimestä otetaan sana "slim" pois. **** Myös integrity-attribuutti tulee poistaa. Tämän jälkeen sivulle ladataan jQueryn koko versio, jossa on myös seuraavassa tarvitsemamme AJAX-toiminnallisuus mukana.

```markup
    <script
      src="https://code.jquery.com/jquery-3.4.1.min.js"
      crossorigin="anonymous"
    ></script>
```

### AJAX-pyyntöjen lähettäminen jQueryllä

Lomakkeen ja sen sisältämän datan lähettäminen jQueryllä sisältää samat vaiheet kuin natiivilla JavaScriptillä, ainoastaan syntaksi on erilainen. 

```markup
<script
      src="https://code.jquery.com/jquery-3.4.1.min.js"
      crossorigin="anonymous"
    ></script>

    <script>
    // Varmistetaan että sivu on ladattu kokonaan ennenkuin lisäillään kuuntelijoita
      $(() => {
        $("#button1").click(() => {
        // Poimitaan kenttien arvot data-muuttujaan
          var data = {
            email: $("#email").val(),
            pass: $("#pass").val()
          };
     // Lähetetään AJAX olio joka palauttaa vastauksensa status-kenttään   
          $.post("/kirjaudu", data, function(response, status) {
            $("#status").html(response);
          }); // post
        }); // click
      }); // $
    </script>
```

Alla vielä HTML-sivu jQuery-koodin kanssa kokonaisuudessaan.

```markup
<html>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
    crossorigin="anonymous"
  />
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
      <form method="POST" action="/kirjaudu">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
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
          <input
            type="password"
            class="form-control"
            id="pass"
            placeholder="Password"
            name="pass"
          />
        </div>

        <button type="button" id="button1" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
    <div id="status"></div>
    <script
      src="https://code.jquery.com/jquery-3.4.1.min.js"
      crossorigin="anonymous"
    ></script>

    < <script>
    // Varmistetaan että sivu on ladattu kokonaan ennenkuin lisäillään kuuntelijoita
      $(() => {
        $("#button1").click(() => {
        // Poimitaan kenttien arvot data-muuttujaan
          var data = {
            email: $("#email").val(),
            pass: $("#pass").val()
          };
     // Lähetetään AJAX olio joka palauttaa vastauksensa status-kenttään   
          $.post("/kirjaudu", data, function(response, status) {
            $("#status").html(response);
          }); // post
        }); // click
      }); // $
    </script>
  </body>
</html>

```

