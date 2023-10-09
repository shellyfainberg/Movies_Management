import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AddMovieComp from "./Pages/AddMovie";
import EditMovieComp from "./Pages/EditMovie";
import LoginComp from "./Pages/Login";
import MainPageComp from "./Pages/MainPage";
import MoviesComp from "./Pages/Movies";
import MembersComp from "./Pages/Members";
import EditMemberComp from "./Pages/EditMember";
import AddMemberComp from "./Pages/AddMember";
import { AuthProvider, verifyUser } from "./Services/AuthProvider";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginComp />} />

        <Route
          path="/app"
          element={
            <AuthProvider verifyUser={verifyUser}>
              <MainPageComp />
            </AuthProvider>
          }
        >
          <Route path="movies" element={<MoviesComp />} />
          <Route path="edit-movie/:id" element={<EditMovieComp />} />
          <Route path="add-movie" element={<AddMovieComp />} />
          <Route path="members" element={<MembersComp />} />
          <Route path="edit-member/:id" element={<EditMemberComp />} />
          <Route path="add-member" element={<AddMemberComp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
