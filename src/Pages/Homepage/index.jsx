import { useNavigate } from "react-router-dom";
import bgImage from "./../../Assets/heroImage.jpg";
import styles from "./index.module.scss";
import { useContext, useEffect, useState } from "react";
import dataContext from "../../Contexts/GlobalState";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import Footer from "../../Layouts/Footer";
// import Footer from "./../../Layouts/Footer";
import BookmarksIcon from "@mui/icons-material/Bookmarks";


function HomePage() {
  const navigator = useNavigate();
  const store = useContext(dataContext);
  const [news, setNews] = useState(null);
  const [library, setLibrary] = useState(null);
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
    document.title = "Mühasibat Jurnalı";
    // window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    axios.get(Base_Url_Server + "news/preview?limit=4").then((res) => {
      setNews(res.data.data.news);
    });
  }, []);
  useEffect(() => {
    axios.get(Base_Url_Server + "pdfs/preview?limit=4").then((res) => {
      setLibrary(res.data.data.pdfs);
    });
  }, []);
  useEffect(() => {
    axios.get(Base_Url_Server + "services/preview?limit=3").then((res) => {
      setServices(res.data.data.services);
      console.log(first)
    });
  }, []);
  console.log(services)

  console.log(news);

  return (
    <>
      <main>
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
        </section>
        <section className={`${styles.news} ${styles.section}`}>
          <div className={styles.header}>
            <div className={styles.hr}></div>
            <h2>Son xəbərlər</h2>
            <div className={styles.hr}></div>
          </div>
          <div className={styles.container}>
            {news &&
              news?.map((e) => {
                return (
                  <div key={e.id} className={styles.card}>
                    <div className={styles.cardContent}>
                      <div className={styles.cardImage}>
                        <img
                          src={
                            Base_Url_Server +
                            e.image?.split(
                              "/home/muhasibatjurnal/backend-mmu/"
                            )[1]
                          }
                          alt={e.title}
                        />
                      </div>
                      <div className={styles.cardText}>
                        <p className={styles.title}>{e.title}</p>
                        <p>
                          <span>{e.created_at?.split("T")[0]}</span>
                          <span>{e.category_name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.footer}>
            <span className={styles.text} onClick={()=>{
              navigator('/news')
            }
            }>Daha çox</span>
          </div>
        </section>
        <section className={`${styles.library} ${styles.section}`}>
          <div className={styles.header}>
            <div className={styles.hr}></div>
            <h2>Son PDF-lər</h2>
            <div className={styles.hr}></div>
          </div>
          <div className={styles.container}>
            {library &&
              library?.map((e) => {
                return (
                  <div key={e.id} className={styles.card}>
                    <div className={styles.cardContent}>
                      <img src={e.cover} alt={e.title} />
                      <div className={styles.glass}>
                        <button>PDF-i əldə et</button>
                        <button>Demo versiyaya bax</button>
                        <h3>{e.title}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.footer}>
            <span className={styles.text}>Daha çox</span>
          </div>
        </section>
        <section className={`${styles.services} ${styles.section}`}>
          <div className={styles.header}>
            <div className={styles.hr}></div>
            <h2>Son servislər</h2>
            <div className={styles.hr}></div>
          </div>
          <div className={styles.container}>
            {services &&
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
                      <div className={styles.price}>{e.price} $</div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.footer}>
            <span className={styles.text}>Daha çox</span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
