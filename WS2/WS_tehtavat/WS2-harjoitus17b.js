
var fs = require("fs");

var json = require("./jsonni.json");

/*for (var i = 0; i < json.length; i++) {
    console.log("JSON index: " + i);
    var obj = json[i];
    for (var key in obj) {
        var value = obj[key];
        console.log(key + ": " + value);
    }
}*/
console.log("<table border = 1>");
for (var i = 0; i < json.length; i++) {
    //    console.log("JSON index: " + i);
    var obj = json[i];
    console.log("<tr>");
    console.log("<td>" + obj.first_name + "</td>");
    console.log("<td>" + obj.last_name + "</td>");
    console.log("</tr>");
}
console.log("</table");