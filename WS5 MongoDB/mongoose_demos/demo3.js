const mongoose = require("mongoose");
// Connecto to db
mongoose.connect("mongodb://localhost/test");

// Define data model for a cat
const Cat = mongoose.model("Cat", { name: String });

// Find all the Cat objects from the database
Cat.find({}, function(err, cats) {
  if (err) throw err;

  // object of all the users
  console.log(cats);
});

// Find all the Cat objects from the database with name containing Zil
Cat.find({ name: /Zil/ }, function(err, cats) {
  if (err) throw err;

  // object of all the users
  console.log(cats);
});
