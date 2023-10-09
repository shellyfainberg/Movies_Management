const Member = require("../Models/membersModel");
const Sub = require("../Models/subscriptionsModel");

const getAllMembers = () => {
  return Member.find({});
};
const getAllMembersWithSubscriptionInfo = async () => {
  const membersWithSub = [];
  try {
    const members = await Member.find({});
    for (const member of members) {
      const subs = await Sub.find({ memberId: member._id });
      const memberWithSubs = {
        member: member,
        subscriptions: subs,
      };
      membersWithSub.push(memberWithSubs);
    }
    return membersWithSub;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
const getMemberById = async (id) => {
  try {
    return Member.findById(id);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getMemberWithSubscriptionInfo = async (id) => {
  try {
    const member = await Member.findById(id);
    if (!member) {
      console.log("cant get member");
    }
    const subs = await Subs.find({ memberId: id });
    if (!subs) {
      console.log("no subscription found");
    }

    const memberWithSubs = {
      member: member,
      subscriptions: subs,
    };

    return memberWithSubs;
  } catch (error) {
    throw new Error(`cant get data: ${error}`);
  }
};
const createMember = async (member) => {
  try {
    const newMember = new Member(member);
    if (newMember.avatar === null) {
      newMember.avatar =
        "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg";
    }
    await newMember.save();
    return { status: "success", member: newMember };
  } catch (error) {
    console.error("Could not create new member");
  }
};

const updateMember = async (id, member) => {
  try {
    let data = await Member.findByIdAndUpdate(id, member);
    if (!data) {
      throw new Error("Movie not found");
    }
    return { status: "success" };
  } catch (error) {
    console.error("Error update member", error);
  }
};

const deleteMember = async (id) => {
  try {
    const member = await Member.findByIdAndDelete(id);
    await Sub.deleteMany({ memberId: member._id });

    return { status: "success" };
  } catch (error) {
    console.error("Error delete member");
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  getAllMembersWithSubscriptionInfo,
  getMemberWithSubscriptionInfo,
  deleteMember,
};
