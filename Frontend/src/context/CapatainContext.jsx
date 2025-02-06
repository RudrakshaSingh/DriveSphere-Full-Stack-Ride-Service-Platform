/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const values = {
    captain,
    setCaptain,
  };
  return <CaptainDataContext.Provider value={values}>{children}</CaptainDataContext.Provider>;
};
export default CaptainContext;
