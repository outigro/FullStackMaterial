// Tuodaan filesystem-moduuli ohjelmaan
var fs = require("fs");

// Aloitetaan virhealtis ohjelmalohko
try {

  // Luetaan tiedoston sisältö muuttujiin
  //var data = fs.readFileSync("olematon.txt");
  var data = fs.readFileSync("uusiFile.txt");

  // Tulostetaan tiedoston sisältö ruudulle
  console.log("Luettu tiedostosta:");
  console.log(data.toString());

  // Käsitellään virhe, jos sellainen tapahtuu
} catch (err) {
  console.log("Tuli virhe " + err);
}