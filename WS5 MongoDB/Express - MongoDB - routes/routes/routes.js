var express = require("express");
var movieCtrl = require("../movieCtrl");

var router = express.Router();

router.route("/").get(movieCtrl.getResults);
router.route("/allmovies").post(movieCtrl.getAll);
router.route("/selected").get(movieCtrl.getSelected);

module.exports = router;
