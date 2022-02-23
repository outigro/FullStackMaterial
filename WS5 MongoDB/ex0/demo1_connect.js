const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost";

// Database Name
const dbName = "moviesdb";

// Use connect method to connect to the server

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  if (err) {
    console.log("Tapahtui virhe!");
  } else {
    console.log("Connected successfully to server");
    //const db = client.db(dbName);
  }

  client.close();
});
