// server.js
// load the things we need
var express = require("express");
var app = express();

// Serve static content from this dir
app.use(express.static("public"));

// set the view engine to ejs
app.set("view engine", "ejs");
app.locals.pretty = true;

// use res.render to load up an ejs view file

// index page
app.get("/", function(req, res) {
  res.render("pages/index");
});

// about page
app.get("/about", function(req, res) {
  res.render("pages/about", {
    new_title: "New title from the server",
    new_heading: "This was passed from the JS file",
    new_paragraph: `Naomi Johnson had always loved quiet Sludgeside with its narrow, numerous nooks. It was a place where she felt anxious. 
    <p>
    She was a creepy, greedy, brandy drinker with blonde lips and spiky toenails. Her friends saw her as an empty, evil elephant. Once, she had even helped a quickest chicken recover from a flying accident. That's the sort of woman he was. 
    <p>
    Naomi walked over to the window and reflected on her pretty surroundings. The rain hammered like swimming tortoises.`,
    new_footer: "Here is the new footer"
  });
});

// Passing an array as data
var seconddata = [
  { name: "John", age: 25 },
  { name: "Mike", age: 42 },
  { name: "Samantha", age: 51 }
];

app.get("/users", function(req, res) {
  res.render("pages/anotherusers", { users: seconddata });
});

// Määritellään muuttuja
var tervehdys = { teksti: "Hoi Maailma" };
app.get("/tervehdys", function(req, res) {
  // välitetään muuttuja sivupohjalle
  res.render("pages/terve", tervehdys);
});
var ostokset = {
  otsikko: "Ostoslista",
  taulu: ["banaania", "omenaa", "päärynää"]
};
app.get("/ostokset", function(req, res) {
  res.render("pages/ostokset", ostokset);
});

app.listen(8081);
console.log("8081 is the magic port");
