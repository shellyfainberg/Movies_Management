import axios from "axios";

const userLogin = async (user) => {
  try {
    const resp = await axios.post("http://localhost:8000/user/login", user);
    return resp.data;
  } catch (error) {
    throw new Error("Could not Login");
  }
};

const sendPassword = async (email) => {
  try {
    const resp = await axios.post(
      "http://localhost:8000/user/resetPassword",
      email
    );
    return resp;
  } catch (error) {
    throw new Error("Could not send email to user");
  }
};

const getAllMovies = async () => {
  try {
    const resp = await axios.get("http://localhost:8000/movies");
    return resp;
  } catch (error) {
    throw new Error("Could not get all movies from DB");
  }
};

const getAllMembersWithSub = async () => {
  try {
    const resp = await axios.get("http://localhost:8000/members");
    return resp.data;
  } catch (error) {
    throw new Error("Could not get all members with subscription");
  }
};

const createMovie = async (movie) => {
  try {
    const resp = await axios.post("http://localhost:8000/movies", movie);
    return resp.data;
  } catch (error) {
    throw new Error("Could not create new movie");
  }
};
const createMember = async (member) => {
  try {
    const resp = await axios.post("http://localhost:8000/members", member);
    return resp.data;
  } catch (error) {
    throw new Error("Could nor create new member");
  }
};
const createSub = async (sub) => {
  try {
    const resp = await axios.post("http://localhost:8000/subs", sub);
    return resp.data;
  } catch (error) {
    throw new Error("Could nor create new subscription");
  }
};
const updateMovie = async (id, movie) => {
  try {
    const resp = await axios.put(`http://localhost:8000/movies/${id}`, movie);
    return resp.data;
  } catch (error) {
    throw new Error("Could not update movie");
  }
};

const updateMember = async (member, id) => {
  try {
    const resp = await axios.put(`http://localhost:8000/members/${id}`, member);
    return resp.data;
  } catch (error) {
    throw new Error("Could not update member");
  }
};

const deleteMovie = async (id) => {
  try {
    const resp = await axios.delete(`http://localhost:8000/movies/${id}`);
    return resp.data;
  } catch (error) {
    throw new Error("Could not delete movie");
  }
};
const deleteMember = async (id) => {
  try {
    const resp = await axios.delete(`http://localhost:8000/members/${id}`);
    return resp.data;
  } catch (error) {
    return new Error("Could not delete member");
  }
};

export {
  userLogin,
  sendPassword,
  getAllMovies,
  getAllMembersWithSub,
  createMovie,
  createMember,
  createSub,
  updateMovie,
  updateMember,
  deleteMovie,
  deleteMember,
};
