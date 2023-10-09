const mongoose = require("mongoose");

const subsSchema = mongoose.Schema({
  movieId: mongoose.Types.ObjectId,
  memberId: mongoose.Types.ObjectId,
  date: Date,
  movieName:String,
});

const Sub = mongoose.model("subscription", subsSchema);

module.exports = Sub;
