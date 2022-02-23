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

app.get("/demo", function(req, res) {
  //////////////////////////////////////////////

  const MongoClient = require("mongodb").MongoClient;
  // Connection URL
  //const url = "mongodb://localhost:27017/";
  const url = "mongodb://newuser2:password123@ds026018.mlab.com:26018/tuntidemo";

  // Database Name
  const dbName = "tuntidemo";
  const collectionName = "movies";

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
        db.collection(collectionName)
          .find(query)
          .toArray(function(err, result) {
            if (err) {
              console.log(err);
              res.status("400").send({ error: err });
            } else if (result.length) {
              console.log("Found:", result);

              res.render("pages/movies", { movies: result });
            } else {
              console.log('No document(s) found with defined "find" criteria!');
              res.status("400").send({ error: "No document(s) found" });
            }
            //Close connection
            client.close();
          });
      } // else {
    } // function
  );

  //////////////////////////////////////////////
});

app.listen(8081);
console.log("8081 is the magic port");

///////////////
// CALLBACK CODE

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
      }
    }
  );
}
