// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();
// Serve static files from the "public" directory
app.use(express.static("./"));

// Luodaan reitit ja niiden toiminnallisuudet
app.get("/", function(req, res) {
  res.send("Hello World!");
});

// Uusi POST-tyyppiseen sivupyyntöön reagoiva reitti
app.post("/kirjaudu", function(req, res) {
  res.send("Lähetit lomakkeen!");
});

// Oletusreitti joka tarjoillaan, mikäli muihin ei päädytty.
app.get("*", function(req, res) {
  res.send("Cant find the requested page", 404);
});

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function() {
  console.log("Example app listening on port 8081!");
});
