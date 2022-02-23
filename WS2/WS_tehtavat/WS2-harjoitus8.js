var http = require("http");

//create a server object:
http.createServer(function (request, response) {
    // Valitaan Content-type tarjoiltavan sisällön suhteen
    response.writeHead(200, { "Content-Type": "text/plain" });
    // Lähetetään tekstimuotoinen vastaus selaimelle
    response.write("Olet saapunut palvelimen juureen.");

    response.end(); //HTTP vastaus päättyy
})
    .listen(8081); //the server object listens on port 8081