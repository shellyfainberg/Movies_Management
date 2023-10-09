import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { toast, ToastContainer } from "react-toastify";
import { MembersAtom } from "../Atoms";
import MemberComp from "../components/Member";
import { getAllMembersWithSub } from "../Services/APIservice";
import { getFromLocalStorage } from "../Services/SecureStorage";

export default function MembersComp() {
  const [members, setMembers] = useState();
  const [membersFromAtom, setMemberFromAtom] = useAtom(MembersAtom);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  const fetchAllMembers = async () => {
    try {
      const resp = await getAllMembersWithSub();
      setMembers(resp);
      setMemberFromAtom(resp);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let manager = getFromLocalStorage("userSession");
    if (manager.isManager) {
      setIsManager(true);
    }

    if (membersFromAtom && membersFromAtom.length > 0) {
      setMembers(membersFromAtom);
    } else {
      fetchAllMembers();
    }
  }, [membersFromAtom]);

  const addMember = () => {
    navigate("/app/add-member");
  };
  return (
    <>
      {isManager && (
        <div className="members-top">
          <button className="primary-button" onClick={addMember}>
            Add Member
          </button>
        </div>
      )}
      <ToastContainer position="top-center" theme="colored" />
      <div className="members-wrapper">
        {members &&
          members.map((member) => {
            return <MemberComp key={member._id} member={member} />;
          })}
      </div>
    </>
  );
}
