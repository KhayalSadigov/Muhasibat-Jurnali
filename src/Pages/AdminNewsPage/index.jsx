import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import newsData from "../../Data/newsData";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useEffect } from "react";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import dataContext from "../../Contexts/GlobalState";

function AdminNewsPage() {
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
    <div className={styles.adminNews}>
      <div className={styles.header}>
        <h3>Xəbərləri idarə et</h3>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Axtar" />
        </div>
        <button onClick={() => navigate("/admin/add-news")}>
          <AddCircleOutlineIcon /> Əlavə et
        </button>
      </div>
      <div className={styles.newsList}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Şəkil</th>
              <th>Başlıq</th>
              <th>Kontent</th>
              <th>Kateqoriya</th>
              <th>Tarix</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {newsData.map((news, i) => {
              return (
                <tr>
                  <td>{i + 1}</td>
                  <td>
                    <img src={news.image} alt={news.title} />
                  </td>
                  <td className={styles.title}>{news.title}</td>
                  <td className={styles.content}>{news.content}</td>
                  <td>{news.category}</td>
                  <td>{news.date}</td>
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

export default AdminNewsPage;
