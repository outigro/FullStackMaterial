var fs = require("fs");
console.log("Program started...");
var data = fs.readFileSync("example.txt");
console.log(data.toString());

for (var i = 0; i < 15; i++) {

    console.log("Ohjelma jatkaa ruksuttamista kun tiedostoa ladatan...");
}

console.log("Program ended...");

