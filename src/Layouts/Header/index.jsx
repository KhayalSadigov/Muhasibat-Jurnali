import styles from "./index.module.scss";
import logo from "../../Assets/logo.png";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dataContext from "../../Contexts/GlobalState";
import MenuIcon from "@mui/icons-material/Menu";
function Header() {
  const navigator = useNavigate();
  const store = useContext(dataContext);

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div onClick={()=>{navigator('/')}} className={styles.left}>
          <img src={logo} className={styles.logo} alt="accountant" />
          <h3 className={styles.title}>Mühasibat Jurnalı</h3>
        </div>
        <div className={styles.right}>
          <ul>
            <li
              onClick={() => {
                navigator("/");
              }}
              style={
                window.location.pathname == "/"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Ana səhifə
            </li>
            <select
              onChange={(e) => {
                navigator(`/library/${e.target.value}`);
                e.target.value = "";
              }}
              style={
                window.location.pathname == "/library"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              <option value="" selected hidden>
                Kitabxana
              </option>
              <option value="qanun-vericilik">Qanun vericilik</option>
              <option value="qanun-ve-vergi-jurnali">
                Qanun və Vergi jurnalı
              </option>
              <option value="mecelleler">Məcəllələr</option>
              <option value="muhasibat-kitablari">Mühasibat kitabları</option>
              <option value="seminar-ve-kurslar">Seminar və kurslar</option>
            </select>
            <li
              onClick={() => {
                navigator("/services");
              }}
              style={
                window.location.pathname == "/services"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Servislər
            </li>
            <li
              onClick={() => {
                navigator("/news");
              }}
              style={
                window.location.pathname == "/news"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Xəbərlər
            </li>
            <li
              onClick={() => {
                navigator("/calculator");
              }}
              style={
                window.location.pathname == "/calculator"
                  ? { color: "#032062", backgroundColor: "white" }
                  : {}
              }
            >
              Kalkulyator
            </li>
            {/* <li></li> */}
          </ul>
        </div>
        <MenuIcon onClick={()=>{store.sidebar.setData(!store.sidebar.data)}} className={styles.icons}   />
      </div>
    </div>
  );
}

export default Header;
