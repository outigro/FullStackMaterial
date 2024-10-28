// Bring the module to the program
const MongoClient = require("mongodb").MongoClient;

// Pass & connection address (from MongoDB Atlas-service)
const passwd = "demopass";
const uri =
  "mongodb+srv://dbuser:" +
  passwd +
  "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

// Create new connection object 
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Introduce query to the database as JSON-object. You can use to help for example MondoDB Compass -tools
var query = {
  title: new RegExp("Jedi")
};

// Create connection to database with name "sample_mflix" and there collection  "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
  if (err) throw err;
  // Make the query with help of collection-object
  collection
    .find(query) // query variable contains the query
    .limit(5) // limit result as maximum 5
    .toArray(function(err, result) {
      // Return results as JS-table
      if (err) throw err;
      console.log(result); // Print out results on the screen
      client.close(); // Close connection
    });
});
