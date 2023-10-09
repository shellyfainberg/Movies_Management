const mongoose = require("mongoose");

const userScheam = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  isLoggedIn: Boolean,
  isManager: Boolean,
});
const User = mongoose.model("users", userScheam);

module.exports = User;
