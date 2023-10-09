import React, { useEffect, useState } from "react";
import { userLogin, sendPassword } from "../Services/APIservice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../Services/SecureStorage";
import "../styling/login.scss";
import "../styling/style.scss";

export default function LoginComp() {
  const [user, setUser] = useState({});
  const [emailToReset, setEmailToReset] = useState();
  const [resetPassword, setResetPassword] = useState(false);
  const [rememberMe, setRemeberMe] = useState(false);
  const navigate = useNavigate();

  const notifyError = () =>
    toast.error("Your email or password you entered is incorrect!");

  const notify = () =>
    toast.success("Your password is waiting for you in your inbox");

  useEffect(() => {
    const userLocal = getFromLocalStorage("rememberMe");
    if (userLocal) {
      navigate("/app/movies");
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    try {
      const userResp = await userLogin(user);
      if (userResp) {
        const userSession = {
          token: userResp.token,
          id: userResp.user._id,
          name: userResp.user.fullname,
          isManager: userResp.user.isManager,
        };
        setInLocalStorage("userSession", userSession);
        if (rememberMe) {
          setInLocalStorage("rememberMe", rememberMe);
        }
        navigate("/app/movies");
      } else {
        notifyError();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const changeToForgot = () => {
    setResetPassword(true);
  };
  const sendPasswordToEmail = async () => {
    notify();
    navigate("/app/movies");
    await sendPassword(emailToReset);
  };
  return (
    <div className="background-container">
      <ToastContainer position="top-center" theme="colored" />
      <div className="darken-overlay"></div>
      <div className="content">
        {!resetPassword && (
          <div>
            <h1>Login</h1>
            <form onSubmit={(e) => login(e)}>
              <div>
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <div className="inner">
                  <div className="rememberMe-wrapper">
                    <input
                      type="checkbox"
                      onChange={(e) => setRemeberMe(e.target.checked)}
                    />
                    <span>Remember Me </span>
                  </div>
                  <button className="login-button" type="submit">
                    Log in
                  </button>
                  <br />
                  <a onClick={changeToForgot}>Forgot your password?</a>
                </div>
              </div>
            </form>
          </div>
        )}

        {resetPassword && (
          <div>
            <h1>Reset Password</h1>
            <p>
              Enter the email address with your account and we'll send an email
              with your password
            </p>
            <input
              type="text"
              placeholder="Email"
              onChange={(e) =>
                setEmailToReset({ ...emailToReset, email: e.target.value })
              }
            />
            <div>
              <button
                className="login-button"
                onClick={() => sendPasswordToEmail(emailToReset)}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
