// Tuodaan filesystem-moduuli ohjelmaan
var fs = require("fs");


// Kirjoitetaan data-muuttuja tiedostoon
var data = fs.readFileSync('uusiFile.txt');
data += fs.readFileSync('toinenUusiFile.txt');

// console.log(data.toString());

fs.writeFile('combiningfile.txt', data, (err) => {
    if (err) throw err;
    console.log("Yhdistelmätiedosto on tallennettu...");
})

