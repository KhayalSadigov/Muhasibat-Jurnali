import { useEffect } from "react";
import styles from "./index.module.scss";
import Footer from "../../Layouts/Footer";
import bg from "./../../Assets/heroImage.jpg";
import BookIcon from "@mui/icons-material/Book";
import bookData from "../../Data/bookData";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PreviewIcon from "@mui/icons-material/Preview";
function LibraryPage() {
  useEffect(() => {
    document.title = "Kitabxana";
  }, []);
  return (
    <>
      <section className={styles.library}>
        <div className={styles.hero}>
          <div className={styles.bgImage}>
            <img src={bg} alt="accountant" />
            <h1>Vergi və mühasibatlıq–sənədin hazır, işin asan!</h1>
          </div>
        </div>
        <div className={styles.bookList}>
          <div className={styles.header}>
            <div></div>
            <BookIcon className={styles.icon} />
            <div></div>
          </div>
          <div className={styles.container}>
            {bookData &&
              bookData?.map((e) => {
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
        </div>
      </section>
      <Footer />
    </>
  );
}

export default LibraryPage;
