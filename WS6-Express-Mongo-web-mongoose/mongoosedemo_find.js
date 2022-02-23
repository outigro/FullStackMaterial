// Otetaan moduuli käyttöön
var mongoose = require("mongoose");
var uri =
  "mongodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/mongoosedemos";

// Yhdistetään tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Määritellään User-niminen Schema, eli tietomalli taulukkoon tallennettavista olioista
const User = mongoose.model("User", {
  username: String,
  password: Number,
  birthday: Date
});

User.find({}, function(err, results) {
  console.log(results);
});

User.find({ username: "masamainio" }, function(err, results) {
  console.log(results);
});

var query = { username: "mattivirtanen" };
var options = { new: true };

User.findOneAndUpdate(
  query,
  { username: "Uusi demokäyttäjä", password: 9999 },
  options,
  function(err, results) {
    console.log(results);
  }
);
