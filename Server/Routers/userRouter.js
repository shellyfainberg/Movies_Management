const express = require("express");
const router = express.Router();
const userBLL = require("../BLL/usersBLL");

//login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userBLL.login(email, password);
    res.status(200).json(user);
  } catch (err) {
    req.status(401).json({ error: `Error login failed:${err}` });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    await userBLL.forgotPassword(req.body.email);
    res.status(200).json(res);
  } catch (err) {
    res.status(502).json({ error: `could not send email: ${err}` });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await userBLL.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: `Error fetching users ${err}` });
  }
});

//get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await userBLL.getByUId(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: `Error fecting user ${user}` });
  }
});

module.exports = router;
