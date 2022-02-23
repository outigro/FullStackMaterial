var mongoose = require("mongoose");

var uri =
  "mongodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/sample_mflix";

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, db) {
    //
    var collection = db.collection("movies");

    collection.find().toArray(function(err, results) {
      if (err) throw err;
      console.log(results);
    });
  }
);
