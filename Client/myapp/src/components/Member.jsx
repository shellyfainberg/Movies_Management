import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSub, deleteMember } from "../Services/APIservice";
import Modal from "react-modal";
import { EditSVG } from "../svg/EditSVG";
import { LocationSVG } from "../svg/LocationSVG";
import { DobSVG } from "../svg/DobSVG";
import { EmailSvg } from "../svg/EmailSvg";
import { useAtom } from "jotai";
import { MembersAtom, MoviesAtom } from "../Atoms";
import { getFromLocalStorage } from "../Services/SecureStorage";
import "../Styling/member.scss";

export default function MemberComp(props) {
  const member = props.member.member;

  const [subscription, setSubscription] = useState(props.member.subscriptions);
  const [moviesListForMember, setMoviesListForMember] = useState([]);

  const [addSub, setAddSub] = useState(false);
  const [newSub, setNewSub] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);

  const [membersFromAtom, setMembersFromAtom] = useAtom(MembersAtom);
  const [moviesFromAtom, setMoviesFromAtom] = useAtom(MoviesAtom);

  const navigate = useNavigate();
  const moviesFromStorge = getFromLocalStorage("movies");
  const formatedDob = member?.dob;

  useEffect(() => {
    if (membersFromAtom && membersFromAtom.length > 0) {
      setSubscription(() => {
        let current = membersFromAtom.find((m) => m.member._id === member._id);
        if (current?.subscriptions) return current.subscriptions;
      });
    }
  }, [membersFromAtom]);

  const editMember = () => {
    sessionStorage.setItem("memberToEdit", JSON.stringify(member));
    navigate(`/app/edit-member/${member._id}`);
  };
  const deleteSelectedMember = async () => {
    const id = member._id;
    await deleteMember(member._id);
    setMembersFromAtom((prevState) =>
      prevState.filter((m) => m.member._id !== id)
    );
    setMoviesFromAtom((prevState) =>
      prevState.map((m) => m.sub.filter((s) => s.memberId !== id))
    );

    setAreYouSure(false);
  };
  const switchToAddSubscription = () => {
    setAddSub(!addSub);

    const selectedMovies = moviesFromAtom?.filter((movie) => {
      return !movie?.sub?.some(
        (subscriber) => subscriber.memberId === member._id
      );
    });
    setMoviesListForMember(selectedMovies);
  };
  const addSubscription = async () => {
    const resp = await createSub(newSub);

    setMembersFromAtom((prevState) => {
      const updatedMembers = prevState.find((m) =>
        m.member._id === member._id
          ? {
              ...m,
              subscriptions: [...m.subscriptions, newSub],
            }
          : m
      );
      return updatedMembers;
    });
    setMoviesFromAtom(resp.movies);
    setAddSub(false);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const subStyles = {
    content: { width: "570px", margin: "auto" },
    overlay: {
      background: "rgba(0, 0, 0, 0.8)",
    },
  };

  const customStyles = {
    content: { width: "40%", height: "40%", margin: "auto" },
    overlay: {
      background: "rgba(0, 0, 0, 0.8)",
    },
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const goToMoviesPage = (movieName) => {
    sessionStorage.setItem("filterdMovie", movieName);
    navigate("/app/movies");
  };
  return (
    <>
      <div className="member-wrapper">
        <div className="member-card">
          <div className="image-wrapper">
            <img src={member?.avatar} alt="member-image" />
            <div className="buttons-wrapper edit">
              <a className="edit" onClick={editMember}>
                <EditSVG />
              </a>
            </div>
          </div>
          <div className="member-details">
            <span className="name">{member?.name}</span>
            <div className="details-wrapper">
              <div className="svg-wrapper">
                <LocationSVG />
              </div>
              <span>{member?.city}</span>
              <span>, {member?.country?.toUpperCase()}</span>
            </div>
            <div className="details-wrapper">
              <div className="svg-wrapper">
                <DobSVG />
              </div>
              <span>
                {new Date(formatedDob).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="details-wrapper">
              <div className="svg-wrapper">
                <EmailSvg />
              </div>
              <span>{member?.email}</span>
            </div>
          </div>
        </div>

        <div className="moviesMember-card">
          {(subscription?.length === 0 || subscription == undefined) && (
            <h3>No Subscriptions</h3>
          )}
          {subscription?.length > 0 && (
            <div className="leftSide">
              <div className="moviesWatched">
                <h3> Movies Watched :</h3>
                <ul>
                  {subscription.map((sub) => {
                    return (
                      <li key={sub._id}>
                        <a onClick={() => goToMoviesPage(sub.movieName)}>
                          {sub.movieName}
                        </a>
                        <br />
                        <span>
                          {new Date(sub.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {subscription?.length > 2 && (
                <div className="showMore">
                  <a onClick={openModal}>{`+${
                    subscription?.length - 2
                  } more`}</a>
                </div>
              )}
            </div>
          )}

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={subStyles}
          >
            <h2>All Subscriptions</h2>
            {subscription?.map((sub) => {
              return (
                <div key={sub._id} className="subMovie-wrapper">
                  <div>
                    <a onClick={() => goToMoviesPage(sub.movieName)}>
                      <img
                        src={
                          moviesFromStorge?.find(
                            (movie) => movie._id === sub.movieId
                          )?.thumbnail
                        }
                        alt="movie-image"
                      />
                    </a>
                  </div>
                  <div className="movie-details">
                    <span>{sub.movieName}</span>
                    <br />
                    {new Date(sub.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                  </div>
                </div>
              );
            })}
            <div className="close-wrapper">
              <span>Total Subscriptions: {subscription?.length}</span>
              <br />
              <button className="secondary-button " onClick={closeModal}>
                Close
              </button>
            </div>
          </Modal>

          <div className="rightSide">
            {!addSub && (
              <div>
                <button
                  className="primary-button"
                  onClick={switchToAddSubscription}
                >
                  + Add Subscription
                </button>
              </div>
            )}

            {addSub && (
              <div className="inner">
                <h3>Add new Movie</h3>
                <select
                  onChange={(e) => {
                    const selectMovie = JSON.parse(e.target.value);
                    setNewSub({
                      ...newSub,
                      movieId: selectMovie._id,
                      movieName: selectMovie.title,
                      memberId: member._id,
                    });
                  }}
                >
                  <option value="">Select an option</option>
                  {moviesListForMember.map((movie) => {
                    return (
                      <option key={movie._id} value={JSON.stringify(movie)}>
                        {movie.title}
                      </option>
                    );
                  })}
                </select>
                <input
                  className="select-input"
                  type="date"
                  onChange={(e) =>
                    setNewSub({ ...newSub, date: e.target.value })
                  }
                />
                <div className="sub-buttons-wrapper">
                  <button className="primary-button" onClick={addSubscription}>
                    Add
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => setAddSub(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="delete-wrapper">
          <a className="delete" onClick={() => setAreYouSure(true)}>
            remove member
          </a>
        </div>

        <Modal
          isOpen={areYouSure}
          onRequestClose={() => setAreYouSure(false)}
          style={customStyles}
        >
          <div className="modal-inner">
            <h2>Delete the member ?</h2>
            <span> You will not be able to recover it </span>
            <div className="modal-btn">
              <button
                className="primary-button "
                onClick={() => deleteSelectedMember()}
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
      </div>
    </>
  );
}
