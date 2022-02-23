// Otetaan moduuli käyttöön
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: Number,
  birthday: Date
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
userSchema.methods.sayHi = function() {
  var greeting =
    "Hello, my name is " + this.username + ". I was born on " + this.birthday;
  console.log(greeting);
};

// Määritellään User-niminen Schema, eli tietomalli taulukkoon tallennettavista olioista
const User = mongoose.model("User", userSchema);

var uri =
  "mongodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/mongoosedemos";

// Yhdistetään tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Luodaan uusi tallennettava olio
var newUser = new User({
  username: "fannyfunktio",
  password: 4321,
  birthday: "2000-12-21"
});
newUser.sayHi();

// Tallennetaan olio tietokantaan
newUser
  .save()
  .catch(err => console.log(err))
  .then(r => console.log("Saved " + r));

User.find({}, function(err, results) {
  // console.log(results);
  for (var i = 0; i < results.length; i++) {
    results[i].sayHi();
  }
});
