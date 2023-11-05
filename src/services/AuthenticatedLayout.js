import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthenticatedLayout({ children, isAuthenticated }) {
  const navigate = useNavigate();
  console.log(isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
    //   navigate("/", { replace: false });
    }
  }, [isAuthenticated, navigate]);

  return <div>{children}</div>;
}

export default AuthenticatedLayout;