import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import serviceData from "../../Data/serviceData";
import { useContext, useEffect } from "react";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import dataContext from "../../Contexts/GlobalState";

function AdminServicesPage() {
  const navigate = useNavigate();
  const store = useContext(dataContext);
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
    <div className={styles.adminServices}>
      <div className={styles.header}>
        <h3>Servisləri idarə et</h3>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Axtar" />
        </div>
        <button onClick={() => navigate("/admin/add-service")}>
          <AddCircleOutlineIcon /> Əlavə et
        </button>
      </div>
      <div className={styles.serviceList}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Başlıq</th>
              <th>Servis Haqqında</th>
              <th>Qiymət</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {serviceData.map((service, i) => {
              return (
                <tr key={service.id}>
                  <td>{i + 1}</td>
                  <td className={styles.title}>{service.title}</td>
                  <td className={styles.content}>{service.content}</td>
                  <td>{service.price}</td>
                  <td>
                    <Tooltip title="Redaktə et" placement="top">
                      <button>
                        <EditDocumentIcon />
                      </button>
                    </Tooltip>
                    <Tooltip title="Sil" placement="top">
                      <button>
                        <DeleteIcon />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServicesPage;
