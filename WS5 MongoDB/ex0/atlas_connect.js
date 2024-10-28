// Bring the module to the program
const MongoClient = require("mongodb").MongoClient;

// introduce password and address to the database (from MongoDB Atlas-service)
const passwd = "demopass";
const uri =
  "mongodb+srv://dbuser:" +
  passwd +
  "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

// Make a new client object with URI & needed parameters
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create connection and print out information of lucky/not

client.connect((err, r) => {
  if (err) throw err;
  else console.log("Connected!");
  client.close();
});
