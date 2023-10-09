import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "./SecureStorage";

export const AuthProvider = ({ children, verifyUser }) => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const userIsVerified = verifyUser();

  useEffect(() => {
    setIsVerified(userIsVerified);
    if (!userIsVerified) {
      navigate("/");
    }
  }, [navigate]);

  return isVerified ? children : navigate("/");
};

export const verifyUser = () => {
  let sessionObj = getFromLocalStorage("userSession");
  if (sessionObj) {
    return true;
  }

  let userLocal = getFromLocalStorage("rememberMe");
  if (userLocal) {
    return true;
  }
  return false;
};
