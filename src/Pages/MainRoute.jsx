import { Outlet } from "react-router-dom";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import Sidebar from "../Layouts/Sidebar";

function MainRoute() {
  return (
    <>
      <Sidebar />
      <Header />
      <Outlet />
    </>
  );
}

export default MainRoute;
