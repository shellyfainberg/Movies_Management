import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { MembersAtom } from "../Atoms";
import { createMember } from "../Services/APIservice";
import { useAtom } from "jotai";
import { validateMemberDetails } from "../Services/fromValidation";
import { getAllCountries } from "../Services/CountryService";

export default function AddMemberComp() {
  const [membersFromAtom, setMembersFromAtom] = useAtom(MembersAtom);
  const [member, setMember] = useState({
    avatar: null,
  });
  const navigate = useNavigate();
  const notify = () => toast.success("New Member Is Added!");
  const notifyError = (errorMessage) => toast.error(errorMessage);
  const [countries, setCountries] = useState();

  const getCountries = async () => {
    try {
      const resp = await getAllCountries();
      setCountries(resp);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const create = async (e) => {
    e.preventDefault();

    const errorMessage = validateMemberDetails(member);
    if (errorMessage) {
      notifyError(errorMessage);
    } else {
      const resp = await createMember(member);
      setMembersFromAtom((prevState) => [
        ...prevState,
        { member: resp.member },
      ]);
      notify();
      setTimeout(() => {
        navigate("/app/members");
      }, 2000);
    }
  };
  const cancel = () => {
    navigate("/app/members");
  };
 
  return (
    <div className="edit-wrapper">
      <ToastContainer position="top-center" theme="colored" />
      <div className="container">
        <form onSubmit={(e) => create(e)}>
          <div className="form-group">
            <label htmlFor=""> Name: </label>
            <input
              type="text"
              onChange={(e) => setMember({ ...member, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor=""> Email: </label>
            <input
              type="email"
              onChange={(e) => setMember({ ...member, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor=""> Country: </label>
            <select
              className="select-country"
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
            <label htmlFor=""> City:</label>
            <input
              type="text"
              onChange={(e) => setMember({ ...member, city: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Dob:</label>
            <input
              type="date"
              onChange={(e) => setMember({ ...member, dob: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Avatar Url:</label>
            <input
              type="text"
              onChange={(e) => setMember({ ...member, avatar: e.target.value })}
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
    </div>
  );
}
