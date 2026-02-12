import React from "react";
import { Navigate } from "react-router-dom";

/*
  ProtectedFacultyRoute

  This component protects faculty dashboard routes.
  It checks:

  1. Is user logged in?
  2. Is role = faculty?

  If not → redirect to login page
*/

const ProtectedFacultyRoute = ({ children }) => {
  // Get stored user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user OR role is not faculty → redirect
  if (!user || user.role !== "faculty") {
    return <Navigate to="/faculty-login" />;
  }

  // Otherwise allow access
  return children;
};

export default ProtectedFacultyRoute;
