var express = require("express");
var app = express();

// set the view engine to ejs
app.set("view engine", "ejs");
// Serve static content from this dir
app.use(express.static("public"));
app.locals.pretty = true;

// index page
app.get("/", function(req, res) {
  var result = getResult(function(err, result) {
    //handle err, then you can render your view
    console.log(result);
    res.render("pages/index", { collection: result });
  });
});

app.listen(8081);
console.log("8081 is the magic port");

function getResult(callback) {
  const MongoClient = require("mongodb").MongoClient;

  // Connection URL
  const url = "mongodb://localhost:27017/";

  // Database Name
  const dbName = "moviedb";

  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, client) {
      if (err) {
        console.log("Unable to connect to the mongoDB server. Error:", err);
      } else {
        console.log("Connection established to", url);

        const db = client.db(dbName);

        var query = { title: /star/ };

        db.collection("movies")
          .find(query)
          .limit(15)
          .sort({ year: -1 })
          .toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            client.close();
            callback(err, result);
          });

        // Query the collection
        // db.collection("movies").find(query),
        //   function(err, result) {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       console.log("Found:", result);
        //     }
        //Close connection
      }
      //  }
    }
  );
}
