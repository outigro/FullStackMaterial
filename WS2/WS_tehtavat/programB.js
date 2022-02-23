var fs = require("fs");
console.log("Program started...");
fs.readFile("example.txt", results);

for (var i = 0; i < 15; i++) {

    console.log("Ohjelma jatkaa ruksuttamista kun tiedostoa ladatan...");
}

function results(err, data) {
    if (err) return console.error(err);
    console.log("Tiedoston luvun tulokset: ");
    console.log(data.toString());

}

console.log("Program ended...");