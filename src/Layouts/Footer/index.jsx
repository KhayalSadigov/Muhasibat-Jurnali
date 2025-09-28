import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import logo from "./../../Assets/logo.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Footer() {
  const [path, setPath] = useState(false);

  const handleScroll = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return (
    <>
      <div className={styles.footerStart}>
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.title}>
              <img src={logo} alt="" />
              <h3>Mühasibat jurnalı</h3>
            </div>
            <p className={styles.paragraph}>
              Vergi və hesabat işləri artıq sizin üçün çətinlik yaratmayacaq.
              Peşəkar komandamız dəqiq, sürətli və etibarlı xidmətlə daim
              yanınızdadır.
            </p>
          </div>
          {/* <div className={styles.hr}></div> */}
          <div className={styles.navigation}>
            <div className={styles.title}>
              <h3>Naviqasiya</h3>
            </div>
            <ul>
              <li>
                <ArrowForwardIosIcon className={styles.icon} />
                Ana səhifə
              </li>
              <li>
                <ArrowForwardIosIcon className={styles.icon} />
                Servislər
              </li>
              <li>
                <ArrowForwardIosIcon className={styles.icon} />
                Xəbərlər
              </li>
              <li>
                <ArrowForwardIosIcon className={styles.icon} />
                Kalkulyator
              </li>
            </ul>
          </div>
          {/* <div className= {styles.hr}></div> */}

          <div className={styles.security}>
            <div className={styles.title}>
              <h3>© Müəllif hüquqları qorunur</h3>
            </div>
            <p className={styles.paragraph}>
              Hər bir saytın məzmunu – məqalələr, dizayn elementləri, şəkillər,
              videolar və proqram təminatı – müəlliflik hüququ ilə qorunur və bu
              materialların icazəsiz istifadəsi qanunsuz hesab olunur.
            </p>
          </div>

          {/* <div className={styles.action}>
            <div className={styles.title}>
              <h3>Hərəkət</h3>
            </div>
            <ul>
              <li onClick={handleScroll}>
                <ArrowForwardIosIcon className={styles.icon} />
                Başlığa qayıt
              </li>
              <li onClick={handleScroll}>
                <ArrowForwardIosIcon className={styles.icon} />
                Başlığa qayıt
              </li>
              <li onClick={handleScroll}>
                <ArrowForwardIosIcon className={styles.icon} />
                Başlığa qayıt
              </li>
              <li onClick={handleScroll}>
                <ArrowForwardIosIcon className={styles.icon} />
                Başlığa qayıt
              </li>
            </ul>
          </div> */}
        </div>
      </div>
      <a
        href="https://www.instagram.com/reverdigitallab.az?igsh=MTFvamdoOXN1dWxvZg=="
        target="_blank"
        className={styles.footerEnd}
        style={path == "/" ? { display: "none" } : {}}
      >
        Developed by Rever Digital Lab
      </a>
    </>
  );
}

export default Footer;
