var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Define a new schema for blog -- notice the data types!

var blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

// Construct the new model
var Blog = mongoose.model("Blog", blogSchema);

// Create new message object
const newMessage = new Blog({
  title: "Hello World!",
  author: "Mika S",
  body: "Hello there! Hows life?",
  comments: [
    { body: "Interesting message!", date: 1543234937522 },
    { body: "This is spam!", date: 1543244937522 }
  ],
  meta: { votes: 2, favs: 5 }
});

// Create new message object
const message2 = new Blog({
  title: "Greetings from Brazil!",
  author: "Matti",
  body: "Sun is shining here",
  comments: [
    { body: "Very COol!", date: 1543234937522 },
    { body: "Dont trust this guy!", date: 1543244937522 }
  ],
  meta: { votes: "jee", favs: 25 }
});

// Connecto to db
mongoose.connect("mongodb://localhost/test");
// Save the data using save -method and then write to the console
newMessage.save().then(() => console.log("Message saved"));

// Handle error on callback function in save()
message2.save(function(err) {
  if (err) {
    console.log("Tapahtui virhe: " + err);
  } else console.log("Message saved");
});
