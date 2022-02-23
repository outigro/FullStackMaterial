var express = require("express");
var app = express();
// Tuodaan oma funktio itse luodusta moduulista, .js päätettä ei tarvitse
var mongo = require("./modules/mongo");

// set the view engine to ejs
app.set("view engine", "ejs");
// Serve static content from this dir
app.use(express.static("public"));
app.locals.pretty = true;

// index page
app.get("/", function(req, res) {
  var result = mongo.getData(function(err, result) {
    //handle err, then you can render your view
    console.log(result);
    res.render("pages/index", { collection: result });
  });
});

app.listen(8081);
console.log("8081 is the magic port");
