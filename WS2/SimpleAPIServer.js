var data = require("./quotes2.json");
var http = require("http");

//create a server object:
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/json" });
    // response.write( data ); //write a response to the client
    response.write( JSON.stringify( data)  ); //write a response to the client
    response.end(); //end the response
  })
  .listen(8081); //the server object listens on port 8080
