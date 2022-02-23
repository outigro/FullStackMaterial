var fs = require("fs");

// Luetaan tiedoston sisältö muuttujiin
var data1 = fs.readFileSync("uusiFile.txt");
// Tulostetaan tiedoston sisältö ruudulle
console.log("Luettu tiedostosta 1:");
console.log(data1.toString());

var data2 = fs.readFileSync("uusiFile.txt");
// Tulostetaan tiedoston sisältö ruudulle
console.log("Luettu tiedostosta 2:");
console.log(data2.toString());
