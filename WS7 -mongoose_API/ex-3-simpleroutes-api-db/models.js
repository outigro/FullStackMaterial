const mongoose = require("mongoose");

const movieModel = { name: String, year: Number };
// Define data model for a cat
const movie = mongoose.model("movie", movieModel);

// module.exports = mongoose.model("Movie", movieModel);
