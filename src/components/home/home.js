import React from "react";
import Header from "../header/header";
import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* <Header/> */}

      <div className="body">
        <span className="title">
          CATACODE
        </span>
        <p className="desc">
        One place for all your software needs.
        </p>
        <Link to="/login" className="btn">Click Here to Login</Link>
        <Link to="/register" className="link">
          New user? Register here
      </Link>
      </div>
    </>
  );
};

export default Home;
