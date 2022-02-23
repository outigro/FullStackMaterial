var http = require('http');
var axios = require("axios");
const server = http.createServer(function (request, respose) {
  axios
    .get("http://www.omdbapi.com/?s=star+wars&apikey=cbbc6750")
    .then(res => {
       const body = parse(res.data)
       response.writeHead(200, { 'content-type': 'text/html' })
       response.end(body);
    })
    .catch(err => {
       // Handle error if axios fetching fails
       response.writeHead(500, { 'content-type': 'text/plain' })
       response.end('Internal Server Error')
     })
})

server.listen(8081, err => {
  if (err) throw err
  console.log(`Server listens on 8081`)
})

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
