import { useEffect } from "react";
import styles from "./index.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
function AdminHeader() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Admin Panel";
  }, []);
  return (
    <header className={styles.header}>
      {/* <h3>Mühasibat Jurnalı</h3> */}
      <div className={styles.profile} onClick={() => navigate("/admin/profile")}>
        <PersonIcon className={styles.icon} />
        <span>Khayal Sadigov</span>
      </div>
    </header>
  );
}

export default AdminHeader;
