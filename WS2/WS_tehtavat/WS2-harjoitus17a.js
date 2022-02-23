
var fs = require("fs");

var json = require("./jsonni.json");

for (var i = 0; i < json.length; i++) {
    console.log("JSON index: " + i);
    var obj = json[i];
    for (var key in obj) {
        var value = obj[key];
        console.log(key + ": " + value);
    }
}

for (var i = 0; i < json.length; i++) {
    //    console.log("JSON index: " + i);
    var obj = json[i];
    console.log("Etunimi: " + obj.first_name);
    console.log("Sukunimi: " + obj.last_name);

}