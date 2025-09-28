import { createContext, useState } from "react";

const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(true );

  const store = {
    sidebar: {
      data: sidebar,
      setData: setSidebar,
    },
  };

  return <dataContext.Provider value={store}>{children}</dataContext.Provider>;
};

export default dataContext;
