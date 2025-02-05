/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { UserDataContext } from "../context/UserContext";

const UserProtectWrapper = ({ children }) => {
  //in inspect-application
  //we are using it below as user ne login krne ke baad page relod krdiya toh context ka data chle jata hai therefore we set in local
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { setUser } = useContext(UserDataContext);

  const [isLoading, setIsLoading] = useState(true);

  //so that it works instantly the token is removed
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.user);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate, setUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Oval
          height={40}
          width={40}
          color="#3498db"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#f3f3f3"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    ); // Show the spinner while loading
  }
  return <>{children}</>;
};

export default UserProtectWrapper;
