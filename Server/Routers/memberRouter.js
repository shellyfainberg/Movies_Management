const express = require("express");
const router = express.Router();
const memberBLL = require("../BLL/membersBLL");

router.get("/", async (req, res) => {
  try {
    const members = await memberBLL.getAllMembersWithSubscriptionInfo(
      req.params.id
    );
    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json({ error: `Error fetching members ${error}` });
  }
});

router.post("/", async (req, res) => {
  try {
    const newMember = await memberBLL.createMember(req.body);
    return res.status(200).json(newMember);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error creating new member ${error}` });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedMember = req.body;
    const member = await memberBLL.updateMember(req.params.id, updatedMember);
    return res.status(200).json(member);
  } catch (error) {
    return res.status(500).json({ error: `Error fetching member ${error}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await memberBLL.deleteMember(req.params.id);
    return res.status(200).json(deletedMember);
  } catch (error) {
    res.status(500).json({ error: `Error deleting member ${error}` });
  }
});

module.exports = router;
