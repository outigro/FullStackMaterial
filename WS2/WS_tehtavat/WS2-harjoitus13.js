var http = require("http");
var fs = require("fs");

//create a server object:
http.createServer(function (request, response) {
    if (request.url === "/") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/plain" });

        // Lähetetään tekstimuotoinen vastaus selaimelle
        response.write("Nothing to see here..");
    }
    else if (request.url === "/frontpage") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/HTML" });

        var html = fs.readFileSync('./frontpage.html');
        response.write(html);
    }

    else if (request.url === "/contact") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/HTML" });

        var html = fs.readFileSync('./contact.html');
        response.write(html);
    }
    else if (request.url === "/plaintext") {
        // Valitaan Content-type tarjoiltavan sisällön suhteen
        response.writeHead(200, { "Content-Type": "text/plain; charset=UTF-8" });

        var data = fs.readFileSync('./teksti.txt');
        response.write(data);
    }

    else {
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        response.write("Valitsemaasi sivua ei löydy ei vaikka kuinka etsin...");
    }
    response.end(); //HTTP vastaus päättyy
})
    .listen(8081); //the server object listens on port 8081