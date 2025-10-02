import { createContext, useState } from "react";

const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(true);
  const [adminSideBar, setAdminSideBar] = useState(false);
  const store = {
    sidebar: {
      data: sidebar,
      setData: setSidebar,
    },
    adminSideBar: {
      data: adminSideBar,
      setData: setAdminSideBar,
    },
  };

  return <dataContext.Provider value={store}>{children}</dataContext.Provider>;
};

export default dataContext;
