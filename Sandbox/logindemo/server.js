var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

//Serving a static file instead of a written message
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/logindemo.html");
});

//Serving a static file instead of a written message
app.get("/loggedin", function(req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.post("/kirjaudu", function(req, res) {
  console.log(req.body);
  if (req.body.pass == "demo") {
    res.redirect("/loggedin");
    // res.send("Login ok");
  } else {
    res.send("Login NOT ok");
  }
});

app.listen(8080, function() {
  console.log("Example app listening on port 8080!");
});
