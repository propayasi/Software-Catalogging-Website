import React, { useEffect, useRef } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { componentStorageName, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./allcomponents.css";

const AllComponents = ({
  savedComponents,
  setSavedComponents,
  filteredSavedComponents,
  setFilteredSavedComponents,
}) => {
  const loaderRef = useRef();
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("loggedInUser");
  const userRole = localStorage.getItem("userRole");

  const deleteComponent = async (compID) => {
    await deleteDoc(doc(db, componentStorageName, compID)).then(() => {
      setSavedComponents((prev) => prev.filter((item) => item.id !== compID));
      setFilteredSavedComponents((prev) => prev.filter((item) => item.id !== compID));
      alert("Deleted Successfully!");
    });
  };

  useEffect(() => {
    const fetchComponents = async () => {
      const querySnapshot = await getDocs(collection(db, componentStorageName));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (loaderRef.current) loaderRef.current.style.display = "none";
      if (loaderRef.current?.nextElementSibling) loaderRef.current.nextElementSibling.style.display = "unset";
      setSavedComponents(newData);
      setFilteredSavedComponents(newData);
    };

    if (loaderRef.current) loaderRef.current.style.display = "flex";
    if (loaderRef.current?.nextElementSibling) loaderRef.current.nextElementSibling.style.display = "none";
    fetchComponents();
  }, [setSavedComponents, setFilteredSavedComponents]);

  return (
    <>
      <dotlottie-player
        ref={loaderRef}
        src="/loading_anim.json"
        background="transparent"
        speed="1"
        style={{
          width: "18.75rem",
          height: "18.75rem",
          margin: "auto",
          display: "flex",
        }}
        loop
        autoplay
      ></dotlottie-player>

      
      <div className="all-components-header">
        <div className="all-components-title-wrapper">
          <div className="all-components-title">
            {filteredSavedComponents.length <= 0
              ? "No Components Found"
              : "All Components"}
          </div>
        </div>
        <div className="add-component-btn-wrapper">
          <button
            className="add-component-btn"
            onClick={() => navigate("/add-component")}
          >
            ➕ Add Component
          </button>
        </div>
      </div>



      {/* Component Cards */}
      <div className="admin-component-list">
        {filteredSavedComponents.map((item) => (
          <div className="component-card" key={item.id}>
            <h3>{item.componentName}</h3>
            <p>Type: {item.componentType}</p>
            <p>Category: {item.componentCategory}</p>
            <p>Language: {item.programmingLanguage}</p>
            <div
              className="button-row"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {(userRole === "admin" || item.createdBy === currentUser) ? (
                <>
                  <button onClick={() => navigate(`/edit-component/${item.id}`)}>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Do you want to delete this component?")) {
                        deleteComponent(item.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button onClick={() => navigate(`/view-component/${item.id}`)}>
                  View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllComponents;
