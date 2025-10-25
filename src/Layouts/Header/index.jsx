import styles from "./index.module.scss";
import logo from "../../Assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dataContext from "../../Contexts/GlobalState";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";

function Header() {
  const navigator = useNavigate();
  const store = useContext(dataContext);
  console.log(store.user.data);

  // Hüquqi səhifələr üçün yol yoxlaması
  const isLegalPage = () => {
    const path = window.location.pathname;
    return (
      path === "/terms-of-use" ||
      path === "/privacy-policy" ||
      path === "/copyright"
    );
  };

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div
          onClick={() => {
            navigator("/");
          }}
          className={styles.left}
        >
          <img src={logo} className={styles.logo} alt="accountant" />
          <h3 className={styles.title}>Mühasibat Jurnalı</h3>
        </div>
        <div className={styles.right}>
          <ul>
            {/* Ana səhifə */}
            <li
              onClick={() => navigator("/")}
              style={
                window.location.pathname === "/"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Ana səhifə
            </li>

            {/* Kitabxana Dropdown */}
            <li
              onClick={() => navigator("/library")}
              style={
                window.location.pathname === "/library"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Kitabxana
            </li>
            {/* Servislər */}
            <li
              onClick={() => navigator("/services")}
              style={
                window.location.pathname === "/services"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Servislər
            </li>

            {/* Xəbərlər */}
            <li
              onClick={() => navigator("/news")}
              style={
                window.location.pathname === "/news"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Xəbərlər
            </li>

            {/* Kalkulyator */}
            <li
              onClick={() => navigator("/calculator")}
              style={
                window.location.pathname === "/calculator"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Kalkulyator
            </li>

            {/* Hüquqi Məlumatlar Dropdown */}
            <li
              className={styles.dropdown}
              style={
                isLegalPage()
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              <span className={styles.dropdownLabel}>
                Hüquqi Məlumatlar
                {/* <ArrowDropDownIcon className={styles.dropdownIcon} /> */}
              </span>
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/terms-of-use")}
                >
                  İstifadə Şərtləri
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/privacy-policy")}
                >
                  Məxfilik Siyasəti
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/copyright")}
                >
                  Müəllif Hüquqları
                </div>
              </div>
            </li>
            <li
              className={styles.person}
              onClick={() => {
                if (store.user.data) {
                  navigator("/profile");
                } else {
                  navigator("/login");
                }
              }}
              style={
                window.location.pathname == "/calculator"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              <PersonIcon />
            </li>
          </ul>
        </div>
        <MenuIcon
          onClick={() => {
            store.sidebar.setData(!store.sidebar.data);
          }}
          className={styles.icons}
        />
      </div>
    </div>
  );
}

export default Header;
