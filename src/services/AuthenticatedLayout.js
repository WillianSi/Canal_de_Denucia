import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthenticatedLayout = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  return authenticated ? (
    <>{children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthenticatedLayout;