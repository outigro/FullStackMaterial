exports.getData = function getResult(callback) {
  // Connection URL
  const url = "mongodb://localhost:27017/";

  // Database Name
  const dbName = "moviedb";

  const MongoClient = require("mongodb").MongoClient;

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
};
