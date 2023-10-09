const Movies = require("../Models/moviesModel");
const Member = require("../Models/membersModel");
const Sub = require("../Models/subscriptionsModel");

const getMoviesWithSub = async () => {
  const moviesWithSub = [];
  try {
    const movies = await Movies.find({});
    for (const movie of movies) {
      const sub = await Sub.find({ movieId: movie._id });
      let movieWithSub = {
        ...movie.toObject(),
        sub: sub.map((s) => s.toObject()),
      };

      const memberPromises = movieWithSub.sub.map(async (s) => {
        const members = await Member.find({ _id: s.memberId });
        return members.map((m) => m.toObject());
      });

      movieWithSub.member = [].concat(...(await Promise.all(memberPromises)));
      moviesWithSub.push(movieWithSub);
    }
    return moviesWithSub;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const getMovieById = async (id) => {
  try {
    return Movies.findById(id);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const createMovie = async (movie) => {
  try {
    const newMovie = new Movies(movie);
    if (newMovie.thumbnail === null) {
      newMovie.thumbnail =
        "https://media.comicbook.com/files/img/default-movie.png";
    }
    await newMovie.save();
    return { status: "success", movie: newMovie };
  } catch (error) {
    console.error("Error creating new movie", error);
  }
};

const updateMovie = async (id, movie) => {
  try {
    // Update the movie
    let data = await Movies.findByIdAndUpdate(id, movie);

    if (!data) {
      throw new Error("Movie not found");
    }

    // Update the subscription
    const subs = await Sub.find({ movieId: movie._id });
    const updateSubs = subs.map(async (sub) => {
      sub.movieName = movie.title;
      return await sub.save();
    });

    return { movie: data, msg: "Movie updated successfully" };
  } catch (error) {
    throw new Error("Can't update movie");
  }
};

const deleteMovie = async (id) => {
  try {
    const movie = await Movies.findByIdAndDelete(id);
    await Sub.deleteMany({ movieId: movie._id });
    return { status: "success" };
  } catch (error) {
    console.error("Error delete movie", error);
  }
};

module.exports = {
  getMoviesWithSub,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
