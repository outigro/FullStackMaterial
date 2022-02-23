var http = require("http");
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
var data = "<table border = 1>";
for (var i = 0; i < json.length; i++) {
    //    console.log("JSON index: " + i);
    var obj = json[i];
    data += "<tr>";
    data += "<td>" + obj.first_name + "</td>";
    data += "<td>" + obj.last_name + "</td>";
    data += "</tr>";
}
data += "</table";

http.createServer(function (req, res) {

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write(data);
    res.end(); //HTTP vastaus päättyy
})
    .listen(8081);