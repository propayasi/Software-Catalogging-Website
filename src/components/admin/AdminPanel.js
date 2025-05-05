import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import Papa from "papaparse";
import { db, componentStorageName, usersStorageName } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import AllComponents from "../allcomponents/allcomponents";
import SearchBar from "../searchbar/searchbar";
import "./admin.css";

const AdminPanel = () => {
  const [section, setSection] = useState("statistics");
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [filters, setFilters] = useState({ language: "", category: "" });
  const loaderRef = useRef();
  const csvInputRef = useRef();
  const componentCsvInputRef = useRef();
  const navigate = useNavigate();

  const fetchComponents = async () => {
    if (loaderRef.current) loaderRef.current.style.display = "flex";
    const querySnapshot = await getDocs(collection(db, componentStorageName));
    const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setComponents(data);
    setFilteredComponents(data);
    if (loaderRef.current) loaderRef.current.style.display = "none";
  };

  const fetchUsers = async () => {
    const userSnapshot = await getDocs(collection(db, usersStorageName));
    const data = userSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUsers(data);
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteDoc(doc(db, usersStorageName, userId));
      fetchUsers();
    }
  };

  const editUser = async (userId, updatedEmail) => {
    const userRef = doc(db, usersStorageName, userId);
    await updateDoc(userRef, { email: updatedEmail });
    fetchUsers();
  };

  const openUserModal = () => {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");
    const email = prompt("Enter email:");
    if (!username || !password || !email) return alert("All fields are required.");
    addDoc(collection(db, usersStorageName), {
      username,
      password,
      email,
      preferences: { favoriteLanguage: "", preferredCategory: "" },
    }).then(() => fetchUsers());
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const usersToAdd = results.data;
        let added = 0;

        for (const user of usersToAdd) {
          const { username, password, email } = user;
          if (!username || !password) continue;

          await addDoc(collection(db, usersStorageName), {
            username,
            password,
            email: email || "",
            preferences: { favoriteLanguage: "", preferredCategory: "" },
          });
          added++;
        }

        alert(`✅ ${added} user(s) added successfully.`);
        fetchUsers();
      },
      error: (err) => {
        alert("Error reading CSV file: " + err.message);
      },
    });
  };

  const handleComponentCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const componentsToAdd = results.data;
        let added = 0;

        for (const comp of componentsToAdd) {
          const { componentName, componentType, componentCategory, programmingLanguage, codeBlock, designData, documentFile, createdBy } = comp;
          if (!componentName || !componentType || !componentCategory) continue;

          await addDoc(collection(db, componentStorageName), {
            componentName,
            componentType,
            componentCategory,
            programmingLanguage: programmingLanguage || "",
            codeBlock: codeBlock || "",
            designData: designData || "",
            documentFile: documentFile || "",
            createdBy: createdBy || "",
            timestamp: new Date().getTime(),
          });
          added++;
        }

        alert(`✅ ${added} component(s) added successfully.`);
        fetchComponents();
      },
      error: (err) => {
        alert("Error reading component CSV file: " + err.message);
      },
    });
  };

  const filterUsers = () => {
    return users.filter(
      (user) =>
        (searchUser === "" || user.username.includes(searchUser) || user.email?.includes(searchUser)) &&
        (filters.language === "" || user.preferences?.favoriteLanguage === filters.language) &&
        (filters.category === "" || user.preferences?.preferredCategory === filters.category)
    );
  };

  const getTopLanguages = () => {
    const langCount = {};
    components.forEach((comp) => {
      const lang = comp.programmingLanguage;
      if (lang) langCount[lang] = (langCount[lang] || 0) + 1;
    });
    return Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 1)[0];
  };

  const getTopCategories = () => {
    const catCount = {};
    components.forEach((comp) => {
      const cat = comp.componentCategory;
      if (cat) catCount[cat] = (catCount[cat] || 0) + 1;
    });
    return Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 1)[0];
  };

  const getComponentTypeCount = (type) => {
    return components.filter((comp) => comp.componentType === type).length;
  };

  const getMostActiveUser = () => {
    const countMap = {};
    components.forEach((comp) => {
      const creator = comp.createdBy;
      if (creator) countMap[creator] = (countMap[creator] || 0) + 1;
    });
    return Object.entries(countMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  };

  useEffect(() => {
    fetchComponents();
    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <div className="admin-panel">
        <div className="admin-segmented-controls">
          <button onClick={() => setSection("statistics")} className={section === "statistics" ? "active" : ""}>Statistics</button>
          <button onClick={() => setSection("components")} className={section === "components" ? "active" : ""}>Components</button>
          <button onClick={() => setSection("users")} className={section === "users" ? "active" : ""}>User Info</button>
        </div>

        {section === "statistics" && (
          <div className="admin-statistics">
            <div className="stat-card"><h3>Total Components</h3><p>{components.length}</p></div>
            <div className="stat-card"><h3>Total Users</h3><p>{users.length}</p></div>
            <div className="stat-card"><h3>Code Components</h3><p>{getComponentTypeCount("code")}</p></div>
            <div className="stat-card"><h3>Design Components</h3><p>{getComponentTypeCount("design")}</p></div>
            <div className="stat-card"><h3>Document Components</h3><p>{getComponentTypeCount("document")}</p></div>
            <div className="stat-card"><h3>Top Language</h3><p>{getTopLanguages()?.[0] || "-"}</p></div>
            <div className="stat-card"><h3>Top Category</h3><p>{getTopCategories()?.[0] || "-"}</p></div>
            <div className="stat-card"><h3>Most Active User</h3><p>{getMostActiveUser()}</p></div>
            <div className="stat-card"><h3>Avg. Components/User</h3><p>{users.length ? (components.length / users.length).toFixed(2) : 0}</p></div>
          </div>
        )}

        {section === "components" && (
          <>
            <div className="user-controls">
              <button className="btn-green" onClick={() => componentCsvInputRef.current.click()}>
                📤 Upload Component CSV
              </button>
              <input
                type="file"
                accept=".csv"
                ref={componentCsvInputRef}
                onChange={handleComponentCSVUpload}
                style={{ display: "none" }}
              />
            </div>
            <SearchBar
              savedComponents={components}
              setSavedComponents={setComponents}
              filteredSavedComponents={filteredComponents}
              setFilteredSavedComponents={setFilteredComponents}
            />
            <AllComponents
              savedComponents={components}
              setSavedComponents={setComponents}
              filteredSavedComponents={filteredComponents}
              setFilteredSavedComponents={setFilteredComponents}
            />
          </>
        )}

        {section === "users" && (
          <div className="admin-users">
            <h3>User Management</h3>
            <div className="user-controls">
              <input
                type="text"
                placeholder="Search by username or email"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <select value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
                <option value="">Filter by Language</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                <option value="">Filter by Category</option>
                <option value="model">Model</option>
                <option value="views">Views</option>
                <option value="controller">Controller</option>
              </select>
              <button className="btn-green" onClick={openUserModal}>Add User</button>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                style={{ display: "none" }}
                ref={csvInputRef}
              />
              <button className="btn-secondary" onClick={() => csvInputRef.current.click()}>
                📤 Upload User CSV
              </button>
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Language</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterUsers().map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>
                      <input
                        type="text"
                        value={user.email || ""}
                        onChange={(e) => editUser(user.id, e.target.value)}
                      />
                    </td>
                    <td>{user.preferences?.favoriteLanguage || "-"}</td>
                    <td>{user.preferences?.preferredCategory || "-"}</td>
                    <td>
                      <button className="delete-button" onClick={() => deleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
