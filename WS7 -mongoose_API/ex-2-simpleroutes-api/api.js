var express = require("express");
var router = express.Router();

//Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

// Define the home page route
router.get("/", function(req, res) {
  res.send("You need to use POST, PUT, DELETE AND GET requests");
});

router.post("/addmovie", function(req, res) {
  res.json({ message: "Adding movie!" });
});

router.get("/getall", function(req, res) {
  res.json({ message: "Finding all movies!" });
});

module.exports = router;
