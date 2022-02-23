// Tuodaan filesystem-moduuli ohjelmaan
var fs = require("fs");

var data = "Alkuperäinen.";

// Kirjoitetaan data-muuttuja tiedostoon
fs.writeFileSync('uusiFile.txt', data);

// Lisätään tiedoston perään tekstiä
fs.appendFileSync('uusiFile.txt', "\nAlternatively, you can use the synchronous version fs.writeFileSync():");
//fs.writeFileSync('uusiFile.txt', "Uusi teksti");
