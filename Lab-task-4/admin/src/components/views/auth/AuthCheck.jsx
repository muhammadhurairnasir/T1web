import React from "react";
import { useNavigate } from "react-router-dom";

const AuthCheck = (props) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("jwt_access_token")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  return <>{props.children}</>;
};

export default AuthCheck;
