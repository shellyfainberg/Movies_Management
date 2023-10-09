const mongoose = require("mongoose");

const moviesSchema = mongoose.Schema({
  title: String,
  premiered: String,
  genres: [String],
  thumbnail: String,
  rating: Number,
  trailer: String,
  description: String,
  duration: String,
  views: Number,
});

const Movies = mongoose.model("movies", moviesSchema);

module.exports = Movies;
