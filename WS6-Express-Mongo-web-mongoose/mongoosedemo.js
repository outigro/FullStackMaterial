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

// Luodaan uusi tallennettava olio
var newUser = new User({
  username: "masamainio",
  password: 4321,
  birthday: "2000-12-21"
});

// Tallennetaan olio tietokantaan
newUser
  .save()
  .catch(err => console.log(err))
  .then(r => console.log("Saved " + r));
