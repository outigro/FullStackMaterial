var http = require("http");

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
        response.writeHead(200, { "Content-Type": "text/plain" });

        // Lähetetään tekstimuotoinen vastaus selaimelle
        response.write("Olet saapunut reittiin /helloworld");
    }

    else if (request.url === "/json") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/plain" });

        // Lähetetään tekstimuotoinen vastaus selaimelle
        response.write("Olet saapunut reittiin /json");
    }
    else {
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        response.write("Valitsemaasi sivua ei löydy ei vaikka kuinka etsin...");
    }
    response.end(); //HTTP vastaus päättyy
})
    .listen(8081); //the server object listens on port 8081