import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMovie } from "../Services/APIservice";
import { ToastContainer, toast } from "react-toastify";
import { MoviesAtom } from "../Atoms";
import { useAtom } from "jotai";
import { validateMovieDetails } from "../Services/fromValidation";
import "../Styling/editMovie.scss";

export default function AddMovieComp() {
  const [moviesFromAtom, setMoviesFromAtom] = useAtom(MoviesAtom);

  const [movie, setMovie] = useState({
    thumbnail: null,
  });
  const navigate = useNavigate();

  const notify = () => toast.success("New Movie Is Added!");
  const notifyError = (errorMessage) => toast.error(errorMessage);

  const cancel = () => {
    navigate("/app/movies");
  };
  const create = async (e) => {
    e.preventDefault();

    const errorMessage = validateMovieDetails(movie);

    if (errorMessage) {
      notifyError(errorMessage);
    } else {
      const resp = await createMovie(movie);
      setMoviesFromAtom((prevState) => [...prevState, resp.movie]);
      notify();
      setTimeout(() => {
        navigate("/app/movies");
      }, 2000);
    }
  };

  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setMovie({
      ...movie,
      genres: selectedOptions,
    });
  };
  return (
    <div className="edit-wrapper">
      <ToastContainer position="top-center" theme="colored" />
      {movie && (
        <div className="container">
          <form onSubmit={(e) => create(e)}>
            <div className="form-group">
              <label htmlFor=""> Name: </label>
              <input
                required
                type="text"
                onChange={(e) => setMovie({ ...movie, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Geners: </label>
              <select
                className="select-geners"
                multiple
                value={movie.genres}
                onChange={handleGenreChange}
                required
              >
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Animation">Animation</option>
                <option value="Biography">Biography</option>
                <option value="Comedy">Comedy</option>
                <option value="Crime">Crime</option>
                <option value="Drama">Drama</option>
                <option value="Family">Family</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Musical">Musical</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi ">Sci-Fi </option>
                <option value="Thriller">Thriller</option>
                <option value="War">War</option>
                <option value="Western">Western</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor=""> Image url: </label>
              <input
                type="text"
                onChange={(e) =>
                  setMovie({ ...movie, thumbnail: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Trailer: </label>
              <input
                type="text"
                onChange={(e) =>
                  setMovie({ ...movie, trailer: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Premired:</label>
              <input
                type="text"
                onChange={(e) =>
                  setMovie({ ...movie, premiered: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Duration:</label>
              <input
                type="text"
                onChange={(e) =>
                  setMovie({ ...movie, duration: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Views:</label>
              <input
                type="text"
                onChange={(e) => setMovie({ ...movie, views: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor=""> Rating:</label>
              <input
                type="text"
                onChange={(e) => setMovie({ ...movie, rating: e.target.value })}
              />
            </div>
            <div className="buttons-wrapper">
              <button className="primary-button" type="submit">
                Add
              </button>
              <button className="secondary-button" onClick={cancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
