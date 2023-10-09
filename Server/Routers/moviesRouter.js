const express = require("express");
const router = express.Router();
const movieBLL = require("../BLL/moviesBLL");

router.get("/", async (req, res) => {
  try {
    const movies = await movieBLL.getMoviesWithSub();
    return res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: `Error fetching movies ${error}` });
  }
});

router.post("/", async (req, res) => {
  try {
    const newMovie = await movieBLL.createMovie(req.body);
    return res.status(200).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: `Error creating new movie ${error}` });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await movieBLL.updateMovie(id,req.body);
    return res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: `Error updateing movie ${error}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await movieBLL.deleteMovie(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: `Error deleting movies ${err}` });
  }
});

module.exports = router;
