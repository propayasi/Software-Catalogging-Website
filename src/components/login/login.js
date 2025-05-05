import React, { useEffect, useRef, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { db, usersStorageName } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

const LoginPage = ({ isRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cnfpassword, setCnfPassword] = useState("");
  const [email, setEmail] = useState("");
  const [allUserList, setAllUserList] = useState([]);

  const loadingRef = useRef();
  const formRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    loadingRef.current.style.display = "none";
    formRef.current.style.display = "unset";
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, usersStorageName));
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setAllUserList(newData);
  };

  const authenticateUser = async () => {
    if (isRegister) {
      loadingRef.current.style.display = "unset";
      formRef.current.style.display = "none";
      try {
        await addDoc(collection(db, usersStorageName), {
          username: username,
          password: password,
          email: email,
        });
        alert("User successfully registered!");
        setUsername("");
        setPassword("");
        setCnfPassword("");
        setEmail("");
        loadingRef.current.style.display = "none";
        formRef.current.style.display = "unset";
        navigate("/login");
      } catch (e) {
        loadingRef.current.style.display = "none";
        formRef.current.style.display = "unset";
        alert("Unable to register user. Try again later");
      }
    } else {
      let isOkay = false;
      allUserList.map((usr) => {
        if (usr.username === username && usr.password === password) {
          isOkay = true;
        }
        return null;
      });

      if (isOkay) {
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userRole", "user");
        navigate("/dashboard");
      } else {
        alert("Invalid Credentials");
      }
    }
  };

  return (
    <div className="login">
      <span className="title main">
        {isRegister ? "New User Registration" : "User Login"}
      </span>
      <span className="title">Software Component Cataloguing Software</span>

      <dotlottie-player
        ref={loadingRef}
        src="/loading_anim.json"
        background="transparent"
        speed="1"
        style={{
          width: "300px",
          height: "300px",
          margin: "auto",
          display: "flex",
        }}
        loop
        autoplay
      ></dotlottie-player>

      <form ref={formRef}>
        <input
          className="input"
          placeholder="Enter Username"
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
        {isRegister && (
          <>
            <input
              className="input"
              placeholder="Confirm Password"
              type="password"
              onChange={(e) => setCnfPassword(e.target.value)}
              value={cnfpassword}
            />
            <input
              className="input"
              placeholder="Enter Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </>
        )}
      </form>

      <Link
        to="#"
        className="btn"
        onClick={(e) => {
          e.preventDefault();
          if (username === "" || password === "") {
            alert("Please Enter a valid username and password");
          } else if (isRegister && password !== cnfpassword) {
            alert("Passwords do not match!");
          } else {
            let isOkay = true;
            if (isRegister) {
              allUserList.map((usr) => {
                if (usr.username === username) {
                  isOkay = false;
                  alert("This username already exists!");
                }
                return null;
              });
            }
            if (isOkay) authenticateUser();
          }
        }}
      >
        {isRegister ? "Register Now" : "Login"}
      </Link>

      <Link to="/" className="link">Go back</Link>
    </div>
  );
};

export default LoginPage;
