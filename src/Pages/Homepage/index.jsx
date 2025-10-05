import { useNavigate } from "react-router-dom";
import bgImage from "./../../Assets/heroImage.jpg";
import styles from "./index.module.scss";
import { useContext, useEffect } from "react";
import dataContext from "../../Contexts/GlobalState";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";

function HomePage() {
  const navigator = useNavigate();
  const store = useContext(dataContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("user");
    if (!token || !userID) {
      store.user.setData(null);
    } else {
      axios
        .get(Base_Url_Server + "users/" + userID, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          store.user.setData(response.data.data.user);
          console.log(response.data.data.user);
        })
        .catch((error) => {
          console.log(error)
          store.user.setData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);
  useEffect(() => {
    document.title = "Mühasibat Jurnalı";
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.bgImage}>
        <img src={bgImage} alt="accountant" />
        <div className={styles.glass}>
          <div className={styles.container}>
            <h1>
              Vergi və hesabat işləri artıq çətin deyil. Dəqiq və etibarlı
              xidmətlə yanınızdayıq.
            </h1>
            <div className={styles.btns}>
              <ul>
                <li
                  onClick={() => {
                    navigator("/about");
                  }}
                >
                  Haqqımızda
                </li>
                <li
                  onClick={() => {
                    navigator("/services");
                  }}
                >
                  Servislər
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <a
        href="https://www.instagram.com/reverdigitallab.az?igsh=MTFvamdoOXN1dWxvZg=="
        target="_blank"
        className={styles.footer}
      >
        © Developed by Rever Digital Lab
      </a>
    </section>
  );
}

export default HomePage;
