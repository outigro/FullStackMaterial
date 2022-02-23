const mongoose = require("mongoose");
// Connecto to db
mongoose.connect("mongodb://localhost/test");

// Define data model for a cat
const Cat = mongoose.model("Cat", { name: String });

// Create new Cat object
const kitty = new Cat({ name: "Kitty Kat" });
// Save the data using save -method and then write to the console
kitty.save().then(() => console.log("meow"));
