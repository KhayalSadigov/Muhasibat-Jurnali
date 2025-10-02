import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import userData from "../../Data/userData";

function AdminUsersPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.adminUsers}>
      <div className={styles.header}>
        <h3>İstifadəçiləri idarə et</h3>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Axtar" />
        </div>
        <button onClick={() => navigate("/admin/add-user")}>
          <AddCircleOutlineIcon /> Əlavə et
        </button>
      </div>
      <div className={styles.userList}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>İstifadəçi Adı</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Abunəlik</th>
              <th>Yaradılma Tarixi</th>
              <th>Son Giriş</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user,i) => (
              <tr key={user.id}>
                <td>{i+1}</td>
                <td className={styles.username}>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.subscription}</td>
                <td>{user.createdAt}</td>
                <td>{user.lastLogin}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsersPage;
