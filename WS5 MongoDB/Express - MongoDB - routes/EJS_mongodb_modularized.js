var express = require("express");
var app = express();

// set the view engine to ejs
app.set("view engine", "ejs");
// Serve static content from this dir
app.use(express.static("public"));
app.locals.pretty = true;

// Load routes fróm a file
var routes = require("./routes/routes");
app.use("/", routes);

app.listen(8081);
console.log("8081 is the magic port");
