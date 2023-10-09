import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { deleteMovie } from "../Services/APIservice";
import { Tooltip } from "react-tooltip";
import { EditSVG } from "../svg/EditSVG";
import { DeleteSVG } from "../svg/DeleteSVG";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { MembersAtom, MoviesAtom } from "../Atoms";
import "../Styling/movie.scss";

export default function MovieComp(props) {
  const [movie, setMovie] = useState(props.movie);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const navigate = useNavigate();

  const [moviesFromAtom, setMoviesFromAtom] = useAtom(MoviesAtom);
  const [membersFromAtom, setMembersFromAtom] = useAtom(MembersAtom);

  const customStyles = {
    content: { width: "40%", height: "40%", margin: "auto" },
    overlay: {
      background: "rgba(0, 0, 0, 0.8)",
    },
  };
  const star = (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z"
        fillRule="nonzero"
      />
    </svg>
  );
  const halfStar = (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44zm.678 2.033v11.904l4.707 2.505-.951-5.236 3.851-3.662-5.314-.756z"
        fillRule="nonzero"
      />
    </svg>
  );

  const generateStarts = (rating) => {
    // full number?
    const wholeStars = Math.floor(rating);
    // not whole
    const remaining = rating - wholeStars >= 0.5;
    // stars list to fill for each movie
    const stars = [];
    // loop through the number of stars and add whole star
    for (let i = 0; i < wholeStars; i++) {
      stars.push(<React.Fragment key={`full-${i}`}>{star}</React.Fragment>);
    }
    // if the number has remaining in from all the stars, add half star
    if (remaining) {
      stars.push(<React.Fragment key="half">{halfStar}</React.Fragment>);
    }
    return stars;
  };

  const editMovie = (movie) => {
    sessionStorage.setItem("movieToEdit", JSON.stringify(movie));
    navigate(`/app/edit-movie/${movie._id}`);
  };
  const deleteSelectedMovie = async () => {
    setAreYouSure(true);
    const id = movie._id;
    await deleteMovie(movie._id);
    setMoviesFromAtom((prevState) => prevState.filter((m) => m._id !== id));
    setMembersFromAtom((prevState) => {
      const filteredSub = prevState.map((m) => ({
        ...m,
        subscriptions: m.subscriptions.filter((s) => s.movieId !== id),
      }));

      return filteredSub;
    });

    setAreYouSure(false);
  };
  const goToEditMember = (member) => {
    sessionStorage.setItem("memberToEdit", JSON.stringify(member));
    navigate(`/app/edit-member/${member._id}`);
  };

  return (
    <div className="movie-card">
      {!showSub && (
        <div className="container">
          <div>
            {!playTrailer && (
              <img
                src={movie.thumbnail}
                alt="movie-thumbnail"
                onMouseEnter={() => setPlayTrailer(true)}
              />
            )}

            {playTrailer && (
              <ReactPlayer
                onMouseLeave={() => setPlayTrailer(false)}
                width="100%"
                height="227px"
                url={movie.trailer}
                playing={true}
                volume={0.1}
                controls={true}
              ></ReactPlayer>
            )}
          </div>
          <div className="inner-wrapper">
            <div className="starts">{generateStarts(movie.rating)}</div>
            <div className="title-wrapper">
              <span className="title">
                {movie.title}
                <span className="premierd">{`(${movie.premiered})`}</span>
              </span>
            </div>

            <div className="genres-wrapper">
              {movie.genres?.map((g, index) => {
                const isLastGenre = index === movie.genres.length - 1;
                const shouldRenderBullet =
                  !isLastGenre && movie.genres.length > 1;
                return (
                  <span key={index}>
                    {g}
                    {shouldRenderBullet && " • "}
                  </span>
                );
              })}
            </div>

            <div className="sub-wrapper">
              <button
                className="primary-button"
                onClick={() => setShowSub(true)}
              >
                Subscriptions
              </button>
              <Tooltip
                className="custom-tooltip "
                anchorSelect=".edit"
                place="bottom"
              >
                Edit
              </Tooltip>
              <Tooltip
                className="custom-tooltip "
                anchorSelect=".delete"
                place="bottom"
              >
                Delete
              </Tooltip>
              <div className="buttons-wrapper">
                <a className="edit" onClick={() => editMovie(movie)}>
                  <EditSVG />
                </a>
                <a className="delete" onClick={() => setAreYouSure(true)}>
                  <DeleteSVG />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={areYouSure}
        onRequestClose={() => setAreYouSure(false)}
        style={customStyles}
      >
        <div className="modal-inner">
          <h2>Delete the movie ?</h2>
          <span> You will not be able to recover it </span>
          <div className="modal-btn">
            <button
              className="primary-button "
              onClick={() => deleteSelectedMovie()}
            >
              Delete
            </button>
            <button
              className="secondary-button "
              onClick={() => setAreYouSure(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* subscription part */}
      {movie.sub?.forEach((s) => {})}

      {showSub && (
        <div className="subscription-details">
          <div className="inner">
            {movie.member?.length >= 1 && (
              <ul>
                {movie.member.map((m) => {
                  return (
                    <li key={m._id}>
                      <a onClick={() => goToEditMember(m)}>
                        <span className="name">{m.name}&nbsp;</span>
                      </a>
                      {movie.sub.map((s) => {
                        if (s.movieId === movie._id && s.memberId === m._id) {
                          return (
                            <span>
                              {new Date(s.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                              <br />
                            </span>
                          );
                        }
                      })}
                    </li>
                  );
                })}
              </ul>
            )}
            {(movie.member?.length < 1 || movie.member === undefined) && (
              <span>No one is registered for this movie</span>
            )}
          </div>
          <div className="buttons-wrapper">
            <button
              className="secondary-button"
              onClick={() => setShowSub(false)}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
