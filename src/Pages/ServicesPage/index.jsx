import Footer from "../../Layouts/Footer";
import styles from "./index.module.scss";
import bg from "./../../Assets/heroImage.jpg";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import serviceData from "../../Data/serviceData";

function ServicesPage() {
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
          <div className={styles.container}>
            {serviceData &&
              serviceData?.map((e) => {
                return (
                  <div key={e.id} className={styles.card}>
                    <div className={styles.cardContent}>
                      <div className={styles.icons}>
                        <div className={styles.hr}></div>
                        <BookmarksIcon />
                        <div className={styles.hr}></div>
                      </div>
                      <div className={styles.title}>{e.title}</div>
                      <div className={styles.price}>{e.price}</div>
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

export default ServicesPage;
