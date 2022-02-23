// Luetaan JSON tiedosto sisään muuttujaan käyttäen require-komentoa
var json = require("./data.json");

// Tulostetaan JSON-datan sisältämän taulukon neljäs alkio 
console.log(json[3]);

// Tulostetaan kuudennen alkion sisältämän olion address-kentän sisältö
console.log(json[5].address);
