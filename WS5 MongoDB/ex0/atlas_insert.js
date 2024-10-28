// Bring the module to the program
const MongoClient = require("mongodb").MongoClient;

// pass & connection address
const passwd = "demopass";
const uri =
  "mongodb+srv://dbuser:" +
  passwd +
  "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

// Create a new connection object with URI and needed parameters
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Introduce query to the database as JSON-object. (MondoDB Compass)
var query = {
  title: new RegExp("Students new")
};

// Introduction of the new data
var newMovie = {
  title: "Students new movie",
  year: "2024",
  imdbID: "12345678",
  type: "movie",
  poster:
    "https://m.media-amazon.com/images/M/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_SX300.jpg"
};

// Create connection to database "sample_mflix" and collection "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
  if (err) throw err;

  // Make inserting with collection object
  collection.insertOne(newMovie, function(err, r) {
    // Print out to console how many objects have been inserted (1)
    console.log(r.insertedCount);
  });

  // Make still a database query to check, that the inserted is also there
  // Notice, that database check is made with the new movie name
  collection
    .find(query) // query variable contains questionary
    .limit(5) // limit results to 5
    .toArray(function(err, result) {
      //Return results in JS-table
      if (err) throw err;
      console.log(result); // Print out table on screen
      client.close(); // Close connection
    });
});
