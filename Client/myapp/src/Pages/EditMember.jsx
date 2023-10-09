import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { updateMember } from "../Services/APIservice";
import { useAtom } from "jotai";
import { MembersAtom, MoviesAtom } from "../Atoms";
import { validateMemberDetails } from "../Services/fromValidation";
import { getAllCountries } from "../Services/CountryService";

export default function EditMemberComp() {
  const [member, setMember] = useState();

  const [membersFromAtom, setMembersFromAtom] = useAtom(MembersAtom);
  const [moviesFromAtom, setMoviesFromAtom] = useAtom(MoviesAtom);

  const notify = () => toast.success("Your Member Is Updated!");
  const notifyError = (errorMessage) => toast.error(errorMessage);
  const [countries, setCountries] = useState();

  const navigate = useNavigate();
  const cancel = () => {
    navigate("/app/members");
  };
  const getCountries = async () => {
    try {
      const resp = await getAllCountries();
      setCountries(resp);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    const memberString = sessionStorage.getItem("memberToEdit");
    setMember(JSON.parse(memberString));
    getCountries();
  }, []);

  const update = async (e) => {
    e.preventDefault();

    const errorMessage = validateMemberDetails(member);
    if (errorMessage) {
      notifyError(errorMessage);
    } else {
      const id = member._id;
      await updateMember(member, member._id);
      setMembersFromAtom((prevState) =>
        prevState.map((m) =>
          m.member._id === id ? { ...m, member: member } : { ...m }
        )
      );
      setMoviesFromAtom((prevState) =>
        prevState.map((mObj) =>
          mObj.member?.map((m) => (m._id === id ? member : m))
        )
      );

      notify();
      setTimeout(() => {
        navigate("/app/members");
      }, 1000);
    }
  };

  // function will show the member DOB in date input when in edit member page
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="edit-wrapper">
      <ToastContainer position="top-center" theme="colored" />

      {member && (
        <div className="container">
          <div className="image-wrapper">
            <img
              className="avater-img"
              src={member.avatar}
              alt="member-image"
            />
          </div>
          <form onSubmit={(e) => update(e)}>
            <div className="form-group">
              <label htmlFor=""> Name: </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => setMember({ ...member, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Email: </label>
              <input
                type="email"
                value={member.email}
                onChange={(e) =>
                  setMember({ ...member, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Country: </label>
              <select
                className="select-country"
                value={member.country}
                onChange={(e) =>
                  setMember({ ...member, country: e.target.value })
                }
              >
                {countries?.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor=""> City: </label>
              <input
                type="text"
                value={member.city}
                onChange={(e) => setMember({ ...member, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor=""> Dob: </label>
              <input
                type="date"
                value={formatDate(new Date(member.dob))}
                onChange={(e) => setMember({ ...member, dob: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor=""> Avater Url: </label>
              <input
                type="text"
                value={member.avatar}
                onChange={(e) =>
                  setMember({ ...member, avatar: e.target.value })
                }
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
