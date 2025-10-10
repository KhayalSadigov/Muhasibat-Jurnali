import styles from "./index.module.scss";
import logo from "../../Assets/logo.png";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import dataContext from "../../Contexts/GlobalState";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";

function Header() {
  const navigator = useNavigate();
  const store = useContext(dataContext);

  // Aktiv səhifə yoxlaması
  const isActivePage = (paths) => {
    const currentPath = window.location.pathname;
    return paths.some((path) => currentPath.includes(path));
  };

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
              className={styles.dropdown}
              style={
                isActivePage(["/library"])
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              <span className={styles.dropdownLabel}>
                Kitabxana
                {/* <ArrowDropDownIcon className={styles.dropdownIcon} /> */}
              </span>
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/library/qanun-vericilik")}
                >
                  Qanun vericilik
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/library/qanun-ve-vergi-jurnali")}
                >
                  Qanun və Vergi jurnalı
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/library/mecelleler")}
                >
                  Məcəllələr
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/library/muhasibat-kitablari")}
                >
                  Mühasibat kitabları
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => navigator("/library/seminar-ve-kurslar")}
                >
                  Seminar və kurslar
                </div>
              </div>
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
