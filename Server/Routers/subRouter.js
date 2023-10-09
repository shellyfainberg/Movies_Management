const express = require("express");
const router = express.Router();
const subBLL = require("../BLL/subscriptionsBLL");

router.get("/", async (req, res) => {
  try {
    const subs = await subBLL.getSubWithMovieAndMember();
    return res.status(200).json(subs);
  } catch (error) {
    res.status(500).json({ error: `Error fetching subscriptions ${err}` });
  }
});
router.post("/", async (req, res) => {
  try {
    const sub = await subBLL.createSubscription(req.body);
    return res.status(200).json(sub);
  } catch (error) {
    res.status(500).json({ error: `Error creating new subscription ${error}` });
  }
});

module.exports = router;
