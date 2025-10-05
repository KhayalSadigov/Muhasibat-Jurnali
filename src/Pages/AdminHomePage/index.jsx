import React, { useContext, useEffect } from "react";
import tax from "./../../Assets/tax.png";
import styles from "./index.module.scss";
import Base_Url_Server from "../../Constants/baseUrl";
import axios from "axios";
import dataContext from "../../Contexts/GlobalState";
import { useNavigate } from "react-router-dom";
function AdminHomePage() {
  const store = useContext(dataContext);
  const navigate = useNavigate();
   useEffect(() => {
    const tokenAdmin = localStorage.getItem("tokenAdmin");
    const adminID = localStorage.getItem("admin");
    if (!tokenAdmin || !adminID) {
      store.admin.setData(null);
      navigate("/admin/login");
    } else {
      axios
        .get(Base_Url_Server + "users/" + adminID, {
          headers: {
            Authorization: `Bearer ${tokenAdmin}`,
          },
        })
        .then((response) => {
          store.admin.setData(response.data.data.user);
          console.log(response.data.data.user);
        })
        .catch(() => {
          store.admin.setData(null);
          localStorage.removeItem("tokenAdmin");
          localStorage.removeItem("admin");
          navigate("/admin/login");
        });
    }
  }, []);
  return (
    <div className={styles.adminHome}>
      <h1>
        <>Mühasibat Jurnalı</> — İdarə et, Nəzarət et, Etibarlı qərar ver.
      </h1>
    </div>
  );
}

export default AdminHomePage;
