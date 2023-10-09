const Sub = require("../Models/subscriptionsModel");
const Movie = require("../Models/moviesModel");
const Member = require("../Models/membersModel");
const moviesBLL = require("../BLL/moviesBLL");

const createSubscription = async (sub) => {
  try {
    const newSub = new Sub(sub);
    await newSub.save();
    const newMoviesList = await moviesBLL.getMoviesWithSub();
    return { status: "success", subscription: newSub, movies: newMoviesList };
  } catch (error) {
    console.error("Error creating new subscription", error);
  }
};

module.exports = { createSubscription };
