import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, componentStorageName, usersStorageName } from "../../firebase";
import Header from "../header/header";
import "./profile.css";

const ProfilePage = () => {
  const [userComponents, setUserComponents] = useState([]);
  const [preferences, setPreferences] = useState({
    favoriteLanguage: "",
    preferredCategory: "",
  });
  const [email, setEmail] = useState("");
  const [userDocId, setUserDocId] = useState(null);

  const currentUser = localStorage.getItem("loggedInUser");
  const navigate = useNavigate();

  const fetchUserComponents = async () => {
    if (!currentUser) return;
    const q = query(
      collection(db, componentStorageName),
      where("createdBy", "==", currentUser)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUserComponents(data);
  };

  const fetchUserPreferences = async () => {
    if (!currentUser) return;
    const q = query(
      collection(db, usersStorageName),
      where("username", "==", currentUser)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0];
      setUserDocId(docRef.id);
      const userData = docRef.data();
      if (userData.preferences) {
        setPreferences(userData.preferences);
      }
      if (userData.email) {
        setEmail(userData.email);
      }
    }
  };

  const updatePreferences = async () => {
    if (userDocId) {
      const userRef = doc(db, usersStorageName, userDocId);
      await updateDoc(userRef, { preferences, email });
      alert("Profile updated!");
    }
  };

  const deleteComponent = async (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      await deleteDoc(doc(db, componentStorageName, id));
      setUserComponents((prev) => prev.filter((comp) => comp.id !== id));
      alert("Component deleted!");
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchUserComponents();
    fetchUserPreferences();
  }, []);

  return (
    <>
      <Header />
      <div className="profile-page">
        <h2>User Profile</h2>
        <div className="profile-info">
          <p><strong>Username:</strong> {currentUser}</p>
          <label><strong>Email:</strong></label>
          <input
            type="email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="preferences">
          <h3>Update Preferences</h3>
          <label>Favorite Language:</label>
          <input
            type="text"
            value={preferences.favoriteLanguage}
            onChange={(e) =>
              setPreferences({ ...preferences, favoriteLanguage: e.target.value })
            }
          />
          <label>Preferred Category:</label>
          <input
            type="text"
            value={preferences.preferredCategory}
            onChange={(e) =>
              setPreferences({ ...preferences, preferredCategory: e.target.value })
            }
          />
          <button onClick={updatePreferences}>Save Preferences</button>
        </div>

        <div className="component-history">
          <h3>Your Components</h3>
          {userComponents.length === 0 ? (
            <p>No components found.</p>
          ) : (
            <ul className="component-list">
              {userComponents.map((comp) => (
                <li key={comp.id}>
                  <strong>{comp.componentName}</strong> ({comp.componentCategory}, {comp.programmingLanguage})
                  <div className="action-buttons">
                    <button onClick={() => navigate(`/view-component/${comp.id}`)}>View</button>
                    <button onClick={() => navigate(`/edit-component/${comp.id}`)}>Edit</button>
                    <button onClick={() => deleteComponent(comp.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
