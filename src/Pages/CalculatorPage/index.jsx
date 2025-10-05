import styles from "./index.module.scss";
import bg from "./../../Assets/heroImage.jpg";
import Footer from "../../Layouts/Footer";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useContext, useEffect } from "react";
import dataContext from "../../Contexts/GlobalState";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
function CalculatorPage() {
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
          store.user.setData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);
  return (
    <>
      <section className={styles.calculator}>
        <div className={styles.hero}>
          <div className={styles.bgImage}>
            <img src={bg} alt="accountant" />
            <h1>Pensiyanızı dəqiq öyrənin, sabahınıza arxayın olun!</h1>
          </div>
        </div>
        <div className={styles.calc}>
          <div className={styles.header}>
            <div></div>
            <CalculateIcon className={styles.icon} />
            <div></div>
          </div>
          <div className={styles.container}>
            <div className={styles.content}>
              <h3>Pensiya kalkulyatoru</h3>
              <div className={styles.inps}>
                <div className={styles.input}>
                  <input type="number" placeholder="Hazırki yaşı" />
                </div>
                <div className={styles.input}>
                  <input type="number" placeholder="Təqaüd yaşı" />
                </div>
                <div className={styles.input}>
                  <input type="number" placeholder="Aylıq töhvə" />
                </div>
                <div className={styles.input}>
                  <input type="number" placeholder="İllik nominal gəlir (%)" />
                </div>
                <div className={styles.select}>
                  <select>
                    <option value="" selected hidden disabled>
                      Dövr növü
                    </option>
                    <option value="">Aylıq</option>
                    <option value="">İllik</option>
                  </select>
                </div>
              </div>
              <div className={styles.btns}>
                <button>Hesabla</button>
                <button>Təmizlə</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default CalculatorPage;
