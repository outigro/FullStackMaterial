// Otetaan moduuli käyttöön
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 6
  },
  password: {
    type: Number,
    min: [1000, "Liian pieni arvo"],
    max: [99999, "Liian suuri arvo"]
  },
  birthday: {
    type: Date,
    min: "1900-01-01",
    max: "2020-03-31"
  }
});

// Määritellään User-niminen Schema, eli tietomalli taulukkoon tallennettavista olioista
const User = mongoose.model("User", userSchema);

var uri =
  "mongodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/mongoosedemos";

// Yhdistetään tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Luodaan uusi tallennettava olio
var newUser = new User({
  username: "",
  password: 999,
  birthday: "2000-12-21"
});

var error = newUser.validateSync();
console.log("Tarkastettiin jo ennen tallennusta: " + error);

// Tallennetaan olio tietokantaan
newUser
  .save()
  .then(() => console.log("Saved "))
  .catch(err => {
    console.log("Validointivirhe: ");
    console.log(err.message);
    process.exit;
  });
