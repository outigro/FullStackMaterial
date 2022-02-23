// call the packages we need
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// DATABASE SETUP
var url = "mongodb://newuser:password123@ds026018.mlab.com:26018/tuntidemo";
var mongoose = require("mongoose");
mongoose.connect(url);

// Handle the connection event
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// Bear models lives here
var Bear = require("./app/models/bear");

// ROUTES FOR OUR API
// =============================================================================

var indexRoutes = require("./app/routes/test");
//var apiRouter = require("./app/routes/API");

// REGISTER OUR ROUTES -------------------------------
// Serve routes under /api only
//app.use("/api", apiRouter);
// Serve other routes for /
app.use("/", indexRoutes);

// =============================================================================
app.listen(8081);
console.log("Magic happens on port 8081");
