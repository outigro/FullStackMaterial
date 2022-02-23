var express = require("express");
var router = express.Router();

//Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

// Define the home page route
router.get("/all", function(req, res) {
  res.send("Return all data");
});

// Define the about route
router.get("/add", function(req, res) {
  res.send("Add new data");
});

module.exports = router;
