import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import bookData from "../../Data/bookData";

function AdminLibraryPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.adminBooks}>
      <div className={styles.header}>
        <h3>Kitabları idarə et</h3>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Axtar" />
        </div>
        <button onClick={() => navigate("/admin/add-book")}>
          <AddCircleOutlineIcon /> Əlavə et
        </button>
      </div>
      <div className={styles.bookList}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Şəkil</th>
              <th>Başlıq</th>
              <th>Açıqlama</th>
              <th>Qiymət</th>
              <th>Demo</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {bookData.map((book,i) => {
              return (
                <tr key={book.id}>
                  <td>{i+1}</td>
                  <td>
                    <img src={book.cover} alt={book.title} />
                  </td>
                  <td className={styles.title}>{book.title}</td>
                  <td className={styles.content}>{book.desc}</td>
                  <td>{book.price}</td>
                  <td>
                    <a href={book.demo} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  </td>
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

export default AdminLibraryPage;
