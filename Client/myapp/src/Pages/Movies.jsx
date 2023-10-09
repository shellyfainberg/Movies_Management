import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { toast, ToastContainer } from "react-toastify";
import { MembersAtom, MoviesAtom } from "../Atoms";
import MovieComp from "../components/Movie";
import { getAllMovies } from "../Services/APIservice";
import { setInLocalStorage } from "../Services/SecureStorage";
import { SearchSVG } from "../svg/SearchSVG";
import "../Styling/movies.scss";

export default function MoviesComp() {
  const [filteredMovies, setFilteredMovies] = useState();
  const [movies, setMovies] = useState();

  const [moviesFromAtom, setMoviesFromAtom] = useAtom(MoviesAtom);
  const [membersFromAtom, setMemberFromAtom] = useAtom(MembersAtom);
  const [timeOut, setTimeOut] = useState(false);

  const navigate = useNavigate();

  const [movieFromMember, setMovieFromMember] = useState(
    sessionStorage.getItem("filterdMovie")
  );

  useEffect(() => {
    if (moviesFromAtom && moviesFromAtom.length > 0) {
      setFilteredMovies(moviesFromAtom);
    } else {
      fetchAllMovies();
    }
    if (movieFromMember !== null) {
      const filterd = filteredMovies?.filter((movie) =>
        movie.title?.toLowerCase().includes(movieFromMember?.toLowerCase())
      );
      setFilteredMovies(filterd);
      sessionStorage.setItem("filterdMovie", "");
    }
  }, [moviesFromAtom]);

  useEffect(() => {
    membersFromAtom.forEach((member) =>
      setMoviesFromAtom({ ...movies, sub: member.subscriptions })
    );
    setFilteredMovies(moviesFromAtom);
  }, [membersFromAtom]);

  const fetchAllMovies = async () => {
    try {
      const resp = await getAllMovies();
      setMovies(resp.data);
      setFilteredMovies(resp.data);
      setMoviesFromAtom(resp.data);
      setInLocalStorage("movies", resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchMovie = (e) => {
    setMovieFromMember(e.target.value);
    sessionStorage.setItem("filterdMovie", "");

    if (e.target.value === null) {
      setFilteredMovies(moviesFromAtom);
    }
    const filterd = movies.filter((movie) =>
      movie.title?.toLowerCase().includes(e.target.value?.toLowerCase())
    );
    setFilteredMovies(filterd);
  };
  const gotoAddMoviePage = () => {
    navigate("/app/add-movie");
  };
  setTimeout(() => {
    setTimeOut(true);
  }, 1000);
  return (
    <>
      <div className="upper-wrapper">
        <ToastContainer position="top-center" theme="colored" />

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => searchMovie(e)}
            value={movieFromMember|| ""}
          />
          <SearchSVG />
        </div>
        <div className="addMovie-wrapper">
          <button className="primary-button" onClick={gotoAddMoviePage}>
            Add movie
          </button>
        </div>
      </div>

      <div className="movies-wrapper">
        {filteredMovies &&
          filteredMovies.map((movie) => {
            return <MovieComp key={movie._id} movie={movie} />;
          })}
      </div>
      <div>
        {timeOut && filteredMovies && filteredMovies.length < 1 && (
          <h3 className="notFound">
            Sorry, we couldn't retrieve any movies at the moment.
          </h3>
        )}
      </div>
    </>
  );
}
