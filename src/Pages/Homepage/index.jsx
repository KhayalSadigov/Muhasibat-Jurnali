import { useNavigate } from "react-router-dom";
import bgImage from "./../../Assets/heroImage.jpg";
import styles from "./index.module.scss";
import { useEffect } from "react";

function HomePage() {
  const navigator = useNavigate();
  useEffect(() => {
    document.title = "Mühasibat Jurnalı";
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
