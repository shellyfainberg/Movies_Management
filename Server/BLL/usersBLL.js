const User = require("../Models/usersModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const secretMailKey = process.env.MAIL_KEY;


const login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (user && user.password == password) {
    const token = jwt.sign({ id: 1 }, secretKey);
    return { status: "success", token: token, auth: true, user: user };
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "fainbergshelly@gmail.com",
        pass: secretMailKey,
      },
    });

    const mailOptions = {
      from: "fainbergshelly@gmail.com",
      to: email,
      subject: "Password retrievel",
      text: `Hey there! we found your password you silly ${user.password}`,
    };

    transport.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("The email was sent successfully");
      }
    });
  
  } catch (error) {
    console.error(`Cant send email to user: ${error}`);
  }
};

const getAllUsers = async () => {
  try {
    const users = User.find({});
    return users;
  } catch (error) {
    throw new Error("cant get users :", err);
  }
};

const getByUId = async (id) => {
  return await User.findById(id);
};

const createUser = async (user) => {
  const newUser = new User(user);
  await newUser.save();
  return { status: "success", user: newUser };
};
const updateUser = async (user, id) => {
  await User.findByIdAndUpdate(id, user);
  return { status: "success" };
};

const deleteUser = async (id) => {
  await User.findOneAndDelete(id);
  return { status: "success" };
};

module.exports = {
  login,
  forgotPassword,
  getAllUsers,
  getByUId,
  createUser,
  updateUser,
  deleteUser,
};
