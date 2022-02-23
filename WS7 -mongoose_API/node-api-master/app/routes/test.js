var express = require("express");
var router = express.Router();

/* GET test page. */
router.get("/test", function(req, res, next) {
  res.send("It works");
});

module.export = router;
