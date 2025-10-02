import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import newsData from "../../Data/newsData";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

function AdminNewsPage() {
  const navigate = useNavigate();
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
            {newsData.map((news,i) => {
              return (
                <tr>
                  <td>{i+1}</td>
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
