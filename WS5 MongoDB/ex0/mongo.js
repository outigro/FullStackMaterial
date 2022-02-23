var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://readuser:salasana1@ds053128.mlab.com:53128/r0317demodata";

MongoClient.connect(
  url,
  function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { address: "Park Lane 38" };
    dbo
      .collection("userdata")
      .find(query)
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
  }
);
