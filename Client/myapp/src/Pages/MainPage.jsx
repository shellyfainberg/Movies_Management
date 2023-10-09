import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBarComp from "../components/NavBar";

export default function MainPageComp() {
  const [loginPage, setLoginPage] = useState(false);

  return (
    <>
      {!loginPage && <NavBarComp />}
      <div className="main">
        <Outlet />
      </div>
    </>
  );
}
