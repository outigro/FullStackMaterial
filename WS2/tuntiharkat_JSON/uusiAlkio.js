var http = require("http");
var fs = require('fs');
var json = require("./data.json");

console.log("Taulukon koko alussa on :" + json.length);

// Esitellään uusi JS-olio
var newitem = {
    age: 60,
    eyeColor: "Sinivihreä",
    gender: "Male",
    email: "James@mi6.com",
    name: "James Bond",
};
// Lisätään olio taulukon loppuun push()-funktiolla
json.push(newitem);

// Lisätään olio taulukon alkuun unshift()-funktiolla
json.unshift(newitem);

//Taulukon koko ohjelman suorituksen keskellä on...
console.log("Taulukon koko ohjelman suorituksen aikana on :" + json.length);

// Poistetaan lisätyt alkiot...
//json.pop(); // poistaa taulukon viimeisen alkion...

//json.shift(); // poistaa taulukon ensimmäisen alkion...

//Taulukon koko ohjelman lopussa on...
console.log("Taulukon koko ohjelman lopussa on :" + json.length);


// Kirjoitetaan lopuksi tiedosto levylle JSON-muodossa, eli sellaisenaan
var data = JSON.stringify(json, "", 1); // Parametreilla "" ja 1 saadaan kaunis tulostus

// Kirjoitetaan lopuksi tiedosto levylle JSON-muodossa, eli sellaisenaan
fs.writeFileSync("./data1.json", data);
console.log(json[0].name);