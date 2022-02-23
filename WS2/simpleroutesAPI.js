var http = require("http");
var data = require("./quotes2.json");

//create a server object:
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/json" });

    console.log(request.url);

    // Display contents based on requested url

    if (request.url === "/page1") {
      response.write("<h1>You are on page 1</h1>");
      response.write(data[0].quote);
    }
    else if (request.url === "/page2") {
      response.write("<h1>You are on page 2</h1>");
      response.write(data[1].quote);
    }
    else {
      response.write("<h1>This is the default page </h2>");
      response.write(data[2].quote);
    }

    response.end(); //end the response
  })
  .listen(8081); //the server object listens on port 8080
