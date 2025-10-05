import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import bg from "./../../Assets/heroImage.jpg";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import newsData from "../../Data/newsData";
import Footer from "../../Layouts/Footer";
import { useNavigate } from "react-router-dom";
import dataContext from "../../Contexts/GlobalState";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";

function NewsPage() {
  const [news, setnews] = useState(newsData);
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
        })
        .catch((error) => {
          store.user.setData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);
  useEffect(() => {
    document.title = "Xəbərlər";
  }, []);
  return (
    <>
      <section className={styles.news}>
        <div className={styles.hero}>
          <div className={styles.bgImage}>
            <img src={bg} alt="accountant" />
            <h1>
              Vergi Məcəlləsi, qanun dəyişikləri və mühasibatlıq dünyasından ən
              son xəbərlər.
            </h1>
          </div>
        </div>
        <div className={styles.newsList}>
          <div className={styles.header}>
            <div></div>
            <NewspaperIcon className={styles.icon} />
            <div></div>
          </div>
          {/* <input type="text" /> */}
          <div className={styles.container}>
            {newsData &&
              newsData?.map((e) => {
                return (
                  <div key={e.id} className={styles.card}>
                    <div className={styles.cardContent}>
                      <div className={styles.cardImage}>
                        <img src={e.image} alt={e.title} />
                      </div>
                      <div className={styles.cardText}>
                        <span>{e.title}</span>
                        <p>
                          <span>{e.date}</span>
                          <span>{e.category}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default NewsPage;
