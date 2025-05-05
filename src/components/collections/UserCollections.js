import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, componentStorageName, userCollectionsName } from "../../firebase";
import Header from "../header/header";
import SearchBar from "../searchbar/searchbar";

import "./usercollections.css";

const UserCollections = () => {
  const username = localStorage.getItem("loggedInUser");
  const [collections, setCollections] = useState([]);
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState("");

  const fetchCollections = async () => {
    const q = query(
      collection(db, userCollectionsName),
      where("userId", "==", username)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCollections(data);
  };

  const fetchAllComponents = async () => {
    const snapshot = await getDocs(collection(db, componentStorageName));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComponents(data);
    setFilteredComponents(data); // Needed for filtered search
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    await addDoc(collection(db, userCollectionsName), {
      userId: username,
      collectionName: newCollectionName.trim(),
      componentIds: [],
    });
    setNewCollectionName("");
    fetchCollections();
  };

  const deleteCollection = async (id) => {
    await deleteDoc(doc(db, userCollectionsName, id));
    fetchCollections();
  };

  const removeComponent = async (collectionId, compId) => {
    const collectionRef = doc(db, userCollectionsName, collectionId);
    const updated = collections.find((c) => c.id === collectionId);
    const newIds = updated.componentIds.filter((id) => id !== compId);
    await updateDoc(collectionRef, { componentIds: newIds });
    fetchCollections();
  };

  const addComponentToCollection = async () => {
    if (!selectedCollectionId || !selectedComponentId) return;
    const collectionRef = doc(db, userCollectionsName, selectedCollectionId);
    const col = collections.find((c) => c.id === selectedCollectionId);
    if (!col || col.componentIds.includes(selectedComponentId)) return;
    const newIds = [...col.componentIds, selectedComponentId];
    await updateDoc(collectionRef, { componentIds: newIds });
    setSelectedCollectionId("");
    setSelectedComponentId("");
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
    fetchAllComponents();
  }, []);

  return (
    <>
      <Header />
      <div className="collection-container">
        <h2>Your Collections</h2>

        {/* Create New Collection */}
        <div className="collection-creator">
          <input
            type="text"
            placeholder="New Collection Name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <button className="btn-primary" onClick={createCollection}>
            Create
          </button>
        </div>

        {/* Add Component to Collection */}
        <div className="collection-adder">
          <select
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
          >
            <option value="">Select Collection</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.collectionName}
              </option>
            ))}
          </select>

          {/* SearchBar to filter components */}
          <div className="search-wrapper">
            <SearchBar
              savedComponents={components}
              setSavedComponents={setComponents}
              filteredSavedComponents={filteredComponents}
              setFilteredSavedComponents={setFilteredComponents}
            />
          </div>

          {/* Select from filtered results */}
          <select
            value={selectedComponentId}
            onChange={(e) => setSelectedComponentId(e.target.value)}
          >
            <option value="">Select Component</option>
            {filteredComponents.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.componentName} ({comp.programmingLanguage || "N/A"})
              </option>
            ))}
          </select>

          <button className="btn-green" onClick={addComponentToCollection}>
            ➕ Add to Collection
          </button>
        </div>

        {/* Existing Collections */}
        {collections.length === 0 ? (
          <p>No collections yet.</p>
        ) : (
          collections.map((col) => (
            <div className="collection-card" key={col.id}>
              <div className="collection-header">
                <h3>{col.collectionName}</h3>
                <button className="delete-button" onClick={() => deleteCollection(col.id)}>
                  🗑 Delete
                </button>
              </div>
              {col.componentIds.length === 0 ? (
                <p>No components added.</p>
              ) : (
                <ul className="component-list">
                  {col.componentIds.map((compId) => {
                    const comp = components.find((c) => c.id === compId);
                    return comp ? (
                      <li key={comp.id}>
                        <strong>{comp.componentName}</strong>
                        <span>
                          ({comp.componentType} - {comp.programmingLanguage || "N/A"})
                        </span>
                        <button className="remove-btn" onClick={() => removeComponent(col.id, comp.id)}>
                          Remove
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserCollections;
