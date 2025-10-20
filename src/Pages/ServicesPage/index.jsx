import Footer from "../../Layouts/Footer";
import styles from "./index.module.scss";
import bg from "./../../Assets/heroImage.jpg";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import dataContext from "../../Contexts/GlobalState";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";

function ServicesPage() {
  const store = useContext(dataContext);
  const [services, setServices] = useState(null);
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
          store.user.setData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  useEffect(() => {
    axios.get(Base_Url_Server + "services").then((res) => {
      setServices(res.data.data.services);
      console.log(first);
    });
  }, []);
  return (
    <>
      <section></section>
      <section className={styles.services}>
        <div className={styles.hero}>
          <div className={styles.bgImage}>
            <img src={bg} alt="accountant" />
            <h1>Hüquq və mühasibat işlərinizdə etibarlı tərəfdaşınız.</h1>
          </div>
        </div>
        <div className={styles.serviceList}>
          <div className={styles.header}>
            <div></div>
            <MiscellaneousServicesIcon className={styles.icon} />
            <div></div>
          </div>
          <div className={styles.filter}>
            <input type="text" placeholder="Axtar" />

          </div>
          <div className={styles.container}>
            {services ? services &&
              services?.map((e) => {
                return (
                  <div key={e.id} className={styles.card}>
                    <div className={styles.cardContent}>
                      <div className={styles.icons}>
                        <div className={styles.hr}></div>
                        <BookmarksIcon />
                        <div className={styles.hr}></div>
                      </div>
                      <div className={styles.title}>{e.name}</div>
                      <div className={styles.price}>{e.price}</div>
                    </div>
                  </div>
                );
              }) : (
                  <div>Yüklənir</div>
              )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ServicesPage;
