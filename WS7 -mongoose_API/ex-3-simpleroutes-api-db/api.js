var express = require("express");
var router = express.Router();

// Define the home page route
router.get("/", function(req, res) {
  res.send("You need to use POST, PUT, DELETE AND GET requests");
});

router.post("/addmovie", function(req, res) {
  res.json({ message: "Adding movie!" });
});

router.get("/getall", function(req, res) {
  // Add database routine here
  ///////////////////////////////

  var mongoose = require("mongoose");
  require("./models.js");

  var url = "mongodb://newuser:password123@ds026018.mlab.com:26018/tuntidemo";

  // Connecto to db
  mongoose.connect(url);
  // Use the movie-model created in models.js - no schema definition anymore
  var movie = mongoose.model("movie");
  // Find all the Cat objects from the database
  movie
    .find({})
    .limit(10)
    .then(function(err, result) {
      // in case of errors
      if (err) res.status(404).json(err);
      // if we are ok, show the data with statuscode 200 (OK)
      console.log(result);
      res.status(200).json(result);
    });

  ///////////////////////////////
});

module.exports = router;
