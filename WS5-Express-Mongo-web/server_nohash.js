var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// Tuodaan oma funktio itse luodusta moduulista, .js päätettä ei tarvitse
var mongo = require("./modules/mongo");

// set the view engine to ejs
app.set("view engine", "ejs");
// Serve static content from this dir
app.use(express.static("public"));
app.locals.pretty = true;
/////////////////////////////////////////////////////
//Serving a static file instead of a written message
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/logindemo.html");
});

//Serving a static file instead of a written message
app.get("/newuser", function(req, res) {
  res.sendFile(__dirname + "/newuser.html");
});

// add new user
app.post("/adduser", function(req, res) {
  /////////////////////////////////////////////////////

  var newUser = {
    username: req.body.email,
    password: req.body.pass
  };
  console.log(newUser);
  /////////////////////////////////////////////////////

  var result = mongo.addData(newUser, function(err, result) {
    if (err) throw err;
    // Jos lisäys onnistu, niin käyttäjä on luotu
    if (result.insertedCount == 1) {
      res.redirect("/");
    } else {
      res.send("Lisääminen ei onnistunut " + result.insertedCount);
    }
  });
});
/////////////////////////////////////////////////////
app.post("/kirjaudu", function(req, res) {
  console.log("Lomakkeelta saatu: ");
  console.log(req.body);

  // Etsitään olemassaolevaa käyttäjää tunnuksen ja salasanan perusteella

  var existingUser = {
    username: req.body.email,
    password: req.body.pass
  };

  console.log("Existing: ");
  console.log(existingUser);

  // Etsitään tunnusta tietokannasta
  var result = mongo.getData(existingUser, function(err, result) {
    if (err) throw err;
    console.log("getData result: ");
    console.log(result);

    // Jos tulosriviä ei löydy, niin käyttäjää ei ole
    if (result.length == 0) res.send("Käyttäjää ei löydy!");
    // Verrataan käyttäjän kirjoittamaa selväkielistäsalasanaa tietokannasta palautuneeseen salattuun
    else if (req.body.pass == result[0].password) {
      // jos ok,  ohjataan käyttäjä kirjautuneiden alueelle
      console.log("Vertailu ok, salasanat samat.");
      res.render("pages/loggedin", { data: result });
      // Muuten heitetään herja
    } else res.send("Virheellinen tunnus/salasana!");
  });
});
/////////////////////////////////////////////////////
app.listen(8080, function() {
  console.log("Example app listening on port 8080!");
});
