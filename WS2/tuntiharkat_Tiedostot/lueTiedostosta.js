// Tuodaan filesystem-moduuli ohjelmaan
var fs = require("fs");

// Luetaan tiedoston sisältö muuttujiin
var data = fs.readFileSync("uusiFile.txt");
// Tulostetaan tiedoston sisältö ruudulle
console.log("Luettu tiedostosta:");
console.log(data.toString());