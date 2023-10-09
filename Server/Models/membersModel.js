const mongoose = require("mongoose");

const membersShema = mongoose.Schema({
  email: String,
  name: String,
  country: String,
  city: String,
  dob: Date,
  avatar: String,
  isVip: Boolean,
});

const Member = mongoose.model("members", membersShema);

module.exports = Member;
