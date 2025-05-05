import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./adminlogin.css";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loadingRef = useRef();
  const formRef = useRef();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("loggedInUser", username);
      localStorage.setItem("userRole", "admin");
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="login">
      <span className="title main">Admin Login</span>
      <span className="title">Software Component Cataloguing - Admin Access</span>

      <dotlottie-player
        ref={loadingRef}
        src="/loading_anim.json"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px", margin: "auto", display: "none" }}
        loop
        autoplay
      ></dotlottie-player>

      <form ref={formRef}>
        <input
          className="input"
          placeholder="Enter Admin Username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          className="input"
          placeholder="Enter Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </form>

      <button
        className="btn"
        onClick={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        Login as Admin
      </button>
    </div>
  );
};

export default AdminLogin;
