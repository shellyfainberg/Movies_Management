const Member = {
  name: String,
  email: String,
  country: String,
  city: String,
  dob: Date,
  avatar: String,
};

const Movie = {
  title: String,
  premiered: String,
  genres: [String],
  thumbnail: String,
  rating: Number,
  trailer: String,
  duration: String,
  views: Number,
};

export const validateMemberDetails = (objToValidate) => {
  if (!objToValidate) {
    return "All input fields must be filled";
  }

  let keys = Object.keys(Member);
  // loop on all object keys and check if exists
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = objToValidate[key];

    if (key === "name") {
      if (!/^[a-zA-Z\s']+$/.test(value) || value === undefined) {
        return "Enter valid name";
      }
    }

    if (key === "city") {
      if (!/^[a-zA-Z\s-]+$/.test(value) || value === undefined) {
        return "Enter valid city";
      }
    }
  }
  return null;
};
export const validateMovieDetails = (objToValidate) => {
  if (!objToValidate) {
    return "All input fields must be filled";
  }

  let keys = Object.keys(Movie);
  // loop on all object keys and check if exists
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = objToValidate[key];

    if (key === "premiered") {
      if (!/^[0-9]{4}$/.test(value) || value === undefined) {
        return "Please enter valid Year (Premiered)";
      }
    }
    if (key === "views") {
      if (!/^[0-9]+$/i.test(value) || value === undefined) {
        return "Please enter valid views";
      }
    }
    if (key === "rating") {
      if (!/^[0-9]+(\.[0-9]+)?$/.test(value) || value === undefined) {
        return "Plasea enter valid rating between (1-10)";
      }
    }
  }
  return null;
};
