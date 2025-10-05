import { createContext, useState } from "react";

const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(true);
  const [adminSideBar, setAdminSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const store = {
    admin: {
      data: admin,
      setData: setAdmin,
    },
    sidebar: {
      data: sidebar,
      setData: setSidebar,
    },
    adminSideBar: {
      data: adminSideBar,
      setData: setAdminSideBar,
    },
    user: {
      data: user,
      setData: setUser,
    },
  };

  return <dataContext.Provider value={store}>{children}</dataContext.Provider>;
};

export default dataContext;
