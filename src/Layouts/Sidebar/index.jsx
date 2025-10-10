import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useContext } from "react";
import dataContext from "../../Contexts/GlobalState";

function Sidebar() {
  const navigator = useNavigate();
  const store = useContext(dataContext);
  return (
    <>
      <div
        className={styles.glassSideBar}
        style={store.sidebar.data ? { display: "none" } : {}}
        onClick={() => {
          store.sidebar.setData(!store.sidebar.data);
        }}
      ></div>
      <div
        className={styles.sideBar}
        style={store.sidebar.data ? { right: "-100%" } : {}}
      >
        <ul>
          <li
            onClick={() => {
              navigator("/");
              store.sidebar.setData(!store.sidebar.data);
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
              const data = e.target.value;
              e.target.value = "";
              store.sidebar.setData(!store.sidebar.data);
              navigator(`/library/${data}`);
            }}
            style={
              window.location.pathname == "/library"
                ? { color: "#032062", backgroundColor: "white" }
                : {}
            }
          >
            <option value=""  selected hidden>
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
              store.sidebar.setData(!store.sidebar.data);
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
              store.sidebar.setData(!store.sidebar.data);
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
              store.sidebar.setData(!store.sidebar.data);
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
              Profil
            </li>
        </ul>
        
      </div>
      
    </>
  );
}

export default Sidebar;
