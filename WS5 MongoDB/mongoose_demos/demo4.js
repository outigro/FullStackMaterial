const mongoose = require("mongoose");
// Connecto to db
mongoose.connect("mongodb://localhost/test");

// Define data model for a cat
const Cat = mongoose.model("Cat", { name: String });

Cat.findOneAndUpdate(
  // username to find
  { username: "Zildjian" },
  // username to update
  { username: "Muppet" },
  function(err, cats) {
    if (err) throw err;

    // we have the updated user returned to us
    console.log(cats);
  }
);
