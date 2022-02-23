const request = require("request");
var http = require("http");
var data;

request(
  "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
  { json: true },
  (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    data = body;
    console.log(res);
    console.log(body);
    console.log(body.url);
    console.log(body.explanation);
  }
);

function parse(data) {
  var html = "<table>";

  html += "<tr><td>" + data.title + "</td></tr>";
  html += "<tr><td>" + data.explanation + "</td></tr>";
  html += "<tr><td><img src='" + data.url + "'></td></tr>";

  html += "</table>";
  console.log(html);
  return html;
}

//create a server object:
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });

    response.write("<table border='1'>");
    response.write("<tr><td>" + data.title + "</td></tr>");
    response.write("<tr><td>" + data.explanation + "</td></tr>");
    response.write("<tr><td><img src='" + data.url + "'></td></tr>");
    response.write("</table>");

    response.end(); //end the response
  })
  .listen(8081); //the server object listens on port 8080
