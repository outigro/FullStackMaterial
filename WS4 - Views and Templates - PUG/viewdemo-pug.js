// server.js
// load the things we need
var express = require("express");
var app = express();

// set the view engine to ejs
app.set("view engine", "pug");
app.locals.pretty = true;

// use res.render to load up an ejs view file

// index page
app.get("/", function(req, res) {
  res.render("index");
});

var data = {
  users: [
    { name: "John", age: 25 },
    { name: "Mike", age: 42 },
    { name: "Samantha", age: 51 }
  ]
};

app.get("/basic", function(req, res) {
  res.render("basic");
});

app.get("/another", function(req, res) {
  res.render("another", data);
});

app.listen(8081);
console.log("8081 is the magic port");
