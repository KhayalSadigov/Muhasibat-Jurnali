import React, { useContext, useEffect } from "react";
import styles from "./index.module.scss";
import HomeIcon from "@mui/icons-material/Home";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import PeopleIcon from "@mui/icons-material/People";
import dataContext from "../../Contexts/GlobalState";
import BackpackIcon from "@mui/icons-material/Backpack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
function AdminSidebar() {
  const store = useContext(dataContext);
  const navigate = useNavigate();
  return (
    <div
      className={styles.sidebar}
      style={store.adminSideBar.data ? {} : { width: "75px" }}
    >
      <div className={styles.top}>
        <div
          className={styles.title}
          onClick={() => store.adminSideBar.setData(!store.adminSideBar.data)}
        >
          <BackpackIcon className={styles.icon} />
          {store.adminSideBar.data && <h2>Admin Panel</h2>}
        </div>
        <div className={styles.navigation}>
          <ul>
            <li
              onClick={() => {
                store.adminSideBar.setData(false)
                navigate("/admin");
              }}
              style={
                window.location.pathname == "/admin"
                  ? { color: "#2c3e50", backgroundColor: "white" }
                  : {}
              }
            >
              <HomeIcon className={styles.icon} />
              {store.adminSideBar.data && <span>Ana Səhifə</span>}
            </li>
            <li
              onClick={() => {
                store.adminSideBar.setData(false)
                navigate("/admin/news");
              }}
              style={
                window.location.pathname == "/admin/news"
                  ? { color: "#2c3e50", backgroundColor: "white" }
                  : {}
              }
            >
              <NewspaperIcon className={styles.icon} />
              {store.adminSideBar.data && <span>Xəbərlər</span>}
            </li>
            <li
              onClick={() => {
                store.adminSideBar.setData(false)
                navigate("/admin/library");
              }}
              style={
                window.location.pathname == "/admin/library"
                  ? { color: "#2c3e50", backgroundColor: "white" }
                  : {}
              }
            >
              <MenuBookIcon className={styles.icon} />
              {store.adminSideBar.data && <span>Kitablar</span>}
            </li>
            <li
              onClick={() => {
                store.adminSideBar.setData(false)
                navigate("/admin/services");
              }}
              style={
                window.location.pathname == "/admin/services"
                  ? { color: "#2c3e50", backgroundColor: "white" }
                  : {}
              }
            >
              <MiscellaneousServicesIcon className={styles.icon} />
              {store.adminSideBar.data && <span>Servislər</span>}
            </li>
            <li
              onClick={() => {
                store.adminSideBar.setData(false)
                navigate("/admin/users");
              }}
              style={
                window.location.pathname == "/admin/users"
                  ? { color: "#2c3e50", backgroundColor: "white" }
                  : {}
              }
            >
              <PeopleIcon className={styles.icon} />
              {store.adminSideBar.data && <span>İstifadəçilər</span>}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <li
          className={styles.logoutBtn}
          onClick={() => {
            navigate("/");
          }}
        >
          <LogoutIcon className={styles.icon} />
          {store.adminSideBar.data && <span>Sayta qayıt</span>}
        </li>
      </div>
    </div>
  );
}

export default AdminSidebar;
