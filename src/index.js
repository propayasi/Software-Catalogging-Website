import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserCollections from "./components/collections/UserCollections";

import Home from "./components/home/home";
import Dashboard from "./components/dashboard/dashboard";
import AddComponent from "./components/addcomponent/addcomponent";
import ProfilePage from "./components/profile/ProfilePage";
import AdminPanel from "./components/admin/AdminPanel";
import Login from "./components/login/login";
import AdminLogin from "./components/adminlogin/adminlogin";
import ViewComponent from "./components/view/viewcomponent";
import "./global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login isRegister={true} />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-component" element={<AddComponent />} />
      <Route path="/edit-component/:componentID" element={<AddComponent />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/view-component/:componentID" element={<ViewComponent />} />
      <Route path="/collections" element={<UserCollections />} />

    </Routes>

  </BrowserRouter>
);
