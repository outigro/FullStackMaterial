exports.getData = function getResult(existingUser, callback) {
  // Tuodaan moduuli ohjelmaan
  const MongoClient = require("mongodb").MongoClient;

  // Määritellään salasana ja yhteysosoite tietokantaan (tämän saa MongoDB Atlas-palvelusta)
  const passwd = "demopass";
  const uri =
    "mongodb+srv://dbuser:" +
    passwd +
    "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

  // Luodaan uusi yhteysolio käyttäen edellä määriteltyä URI:a sekä
  // tarvittavia parametreja
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
  client.connect(err => {
    const collection = client.db("sample_mflix").collection("demousers");
    if (err) throw err;

    collection.find(existingUser).toArray(function(err, result) {
      if (err) throw err;
      //console.log("mongo.js: " + result);

      callback(err, result);
      //  client.close();
    });
  });
};

exports.addData = function addData(newUser, callback) {
  // Tuodaan moduuli ohjelmaan
  const MongoClient = require("mongodb").MongoClient;

  // Määritellään salasana ja yhteysosoite tietokantaan (tämän saa MongoDB Atlas-palvelusta)
  const passwd = "demopass";
  const uri =
    "mongodb+srv://dbuser:" +
    passwd +
    "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

  // Luodaan uusi yhteysolio käyttäen edellä määriteltyä URI:a sekä
  // tarvittavia parametreja
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
  client.connect(err => {
    const collection = client.db("sample_mflix").collection("demousers");
    if (err) throw err;

    // Suoritetaan lisäys collection-olion avulla
    collection.insertOne(newUser, function(err, result) {
      // Tulostetaan konsoliin tieto montako alkiota on lisätty (1)
      console.log(result.insertedCount);
      callback(err, result);
    });
  });
};
