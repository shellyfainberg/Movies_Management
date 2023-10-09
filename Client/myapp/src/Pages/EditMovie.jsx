import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateMovie } from "../Services/APIservice";
import { ToastContainer, toast } from "react-toastify";
import { validateMovieDetails } from "../Services/fromValidation";
import { useAtom } from "jotai";
import { MoviesAtom, MembersAtom } from "../Atoms";
import "../Styling/editMovie.scss";

export default function EditMovieComp() {
  const [movie, setMovie] = useState();
  const [moviesFromAtom, setMoviesFromAtom] = useAtom(MoviesAtom);
  const [membersFromAtom, setMembersFromAtom] = useAtom(MembersAtom);

  const navigate = useNavigate();
  const notify = () => toast.success("Your Movie Is Updated!");
  const notifyError = (errorMessage) => toast.error(errorMessage);

  useEffect(() => {
    const movieString = sessionStorage.getItem("movieToEdit");
    setMovie(JSON.parse(movieString));
  }, []);
  const cancel = () => {
    navigate("/app/movies");
  };
  const update = async (e) => {
    e.preventDefault();

    const errorMessage = validateMovieDetails(movie);
    if (errorMessage) {
      notifyError(errorMessage);

    } else {
      const id = movie._id;
      await updateMovie( movie._id,movie);
      setMoviesFromAtom((prevState) =>
        prevState.map((m) => (m._id === id ? movie : m))
      );

      setMembersFromAtom((prev) =>
        prev.map((member) => {
          // check if has subscriptions
          if (member.subscriptions) {
            member.subscriptions = member.subscriptions.map((subscription) => {
              if (subscription.movieId === id) {
                subscription.movieName = movie.title;
              }
              return subscription;
            });
          }
          return member;
        })
      );

      notify();
      setTimeout(() => {
        navigate("/app/movies");
      }, 1000);
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
          <div className="image-wrapper">
            <img src={movie.thumbnail} alt="movie-image" />
          </div>
          <h2>{movie.title}</h2>
          <form onSubmit={(e) => update(e)}>
            <div className="form-group">
              <label htmlFor=""> Name: </label>
              <input
                type="text"
                value={movie.title}
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
                <option value="Thriller">Thriller</option>
                <option value="War">War</option>
                <option value="Western">Western</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor=""> Image url: </label>
              <input
                type="text"
                value={movie.thumbnail}
                onChange={(e) =>
                  setMovie({ ...movie, thumbnail: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Trailer: </label>
              <input
                type="text"
                value={movie.trailer}
                onChange={(e) =>
                  setMovie({ ...movie, trailer: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Premired:</label>
              <input
                type="text"
                value={movie.premiered}
                onChange={(e) =>
                  setMovie({ ...movie, premiered: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor=""> Duration:</label>
              <input
                type="text"
                value={movie.duration}
                onChange={(e) =>
                  setMovie({ ...movie, duration: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Views:</label>
              <input
                type="text"
                value={movie.views}
                onChange={(e) => setMovie({ ...movie, views: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor=""> Rating:</label>
              <input
                type="text"
                value={movie.rating}
                onChange={(e) => setMovie({ ...movie, rating: e.target.value })}
              />
            </div>

            <div className="buttons-wrapper">
              <button className="primary-button" type="submit">
                Update
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
