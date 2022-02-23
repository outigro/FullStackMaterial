var axios = require("axios");
var http = require("http");
var fs = require("fs");

//Fetch the API data
function getData() {
  const promise = axios
    .get("http://www.omdbapi.com/?s=star+wars&apikey=cbbc6750")
    .then(res => {
       data = response.data;
      console.log("Axios: "+data);
      return data;
    })
    .catch(error => {
      console.warn("Error while getting data!");
    });
}
// Run through the data
function parse(data) {

  var html = "<table border='1'>";
  for (var i = 0; i < data.Search.length; i++) {
    html += "<tr>";
    html += "<td>" + data.Search[i].Title + "</td>";
    html += "<td>" + data.Search[i].Type + "</td>";
    html += "<td>" + data.Search[i].Year + "</td>";
    html += "<td><img src='" + data.Search[i].Poster + "'></td></td>";
    //  html += "<td>" + data.Search[i].Poster + "</td>";
    html += "</tr>";
  }
  html += "</table>";
  console.log(html);
  return html;
}

// create a server object:
  var data = require("./starwars.json");
    var html = parse(data);

http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });


    // var data = getData();
  //  console.log("Data: " +data);

    response.write( html );
    response.end();
    console.log(html);

    //  response.end(); //end the response
  })
  .listen(8081); //the server object listens on port 8080
// Loop though the data
