import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectWrapper = ({ children }) => {
  //in inspect-application
    //we are using it below as user ne login krne ke baad page relod krdiya toh context ka data chle jata hai
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  //so that it works instantly the token is removed
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <>{children}</>;
};

export default UserProtectWrapper;
