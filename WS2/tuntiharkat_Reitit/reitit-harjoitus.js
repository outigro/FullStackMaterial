var http = require("http");
var fs = require("fs");

//create a server object:
http.createServer(function (request, response) {

    if (request.url === "/") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/plain" });

        // Lähetetään tekstimuotoinen vastaus selaimelle
        response.write("Olet saapunut palvelimen juureen.");
    }
    else if (request.url === "/helloworld") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/html" });

        // Luetaan HTML-tiedosto ja lähetetään se selaimelle
        var html = fs.readFileSync('./etusivu.html');
        response.write(html);
    }

    else if (request.url === "/json") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/json" });

        // Luetaan JSON muotoinen tiedosto ja lähetetään se selaimelle
        var json = require('./data.json');
        response.write(JSON.stringify(json));
    }
    else {
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        response.write("Valitsemaasi sivua ei löydy ei vaikka kuinka etsin...");
    }
    response.end(); //HTTP vastaus päättyy
})
    .listen(8081); // palvelin kuuntelee porttia 8081
