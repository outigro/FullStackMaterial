var http = require("http");
var html = "";

var options = {
  host: "quotes.rest",
  path: "/qod.json"
}; 
var request = http.request(options, function(res) {
  var data = "";
  res.on("data", function(chunk) {
    data += chunk;
  });
  res.on("end", function() {
    console.log(data);

    // Convert the String data to JSON object

    var JSONdata = JSON.parse(data);

    console.log(JSONdata);

    html = "<table>";

    for (var i = 0; i < JSONdata.contents.quotes.length; i++) {
      html += "<tr><td>" + JSONdata.contents.quotes[i].quote + "</td></tr>";
      html += "<tr><td>" + JSONdata.contents.quotes[i].author + "</td></tr>";
      console.log(JSONdata.contents.quotes[i].quote);
      console.log(JSONdata.contents.quotes[i].author);
    }
    html += "</table>";
  });
});
request.on("error", function(e) {
  console.log(e.message);
});
request.end();

var http = require("http");

//create a server object:
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(html);
    response.end("This is the end"); //end the response
  })
  .listen(8081); //the server object listens on port 8080
