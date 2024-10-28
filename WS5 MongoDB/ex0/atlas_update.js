// Bring the module to the peogram
const MongoClient = require("mongodb").MongoClient;

// Introduce password and address to database (from MongoDB Atlas-service)
const passwd = "demopass";
const uri =
  "mongodb+srv://dbuser:" +
  passwd +
  "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

// Make a new client object with URI and other parameters
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Introduce query to database with a JSON-object. You can use MondoDB Compass -tool
var query = {
  title: new RegExp("Jedi")
};

// Connect to database "sample_mflix" and collection "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
  if (err) throw err;

  // Do update with collection-object
  collection.updateMany(
    { title: new RegExp("Jedi") },
    { $set: { year: 1956 } },
    function(err, r) {
      // Print to the console teh amount of inserted objects (1)
      console.log("Changed lines: " + r.modifiedCount);
    }
  );

  var query = {
    title: new RegExp("Jedi")
  };
  // Chect with a query to be sure that database modification has happened (with the new name!)
  
  collection
    .find(query) // query variable has the query needed
    .limit(5) // limit result group to 5
    .toArray(function(err, result) {
      // Return results in JS-tabel
      if (err) throw err;
      console.log(result); // Print out table to the screen
      client.close(); // Close connection
    });
});
