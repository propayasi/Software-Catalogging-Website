import React, { useEffect, useState, useRef } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userMenuRef = useRef();
  const username = localStorage.getItem("loggedInUser") || "User";

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header">
      <h1>Software Component Cataloguing</h1>
      <div className="user-menu" ref={userMenuRef}>
        <button onClick={() => setDropdownOpen((prev) => !prev)}>
          {username} ▾
        </button>
        {dropdownOpen && (
          <div className="user-dropdown">
            <button
              onClick={() => {
                navigate("/profile");
                setDropdownOpen(false);
              }}
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                navigate("/collections");
                setDropdownOpen(false);
              }}
            >
              My Collections
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Header;
