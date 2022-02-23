var http = require("http");

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

    for (var i = 0; i < JSONdata.contents.quotes.length; i++) {
      console.log(JSONdata.contents.quotes[i].quote);
      console.log(JSONdata.contents.quotes[i].author);
    }
  });
});
request.on("error", function(e) {
  console.log(e.message);
});
request.end();
