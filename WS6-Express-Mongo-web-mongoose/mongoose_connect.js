var mongoose = require("mongoose");
var uri =
  "mongodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/sample_mflix";

mongoose.connect(uri);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});
