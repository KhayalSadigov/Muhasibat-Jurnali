import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import dataContext from "../../Contexts/GlobalState";
import Swal from "sweetalert2";

function AdminUsersPage() {
  const navigate = useNavigate();
  const store = useContext(dataContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ password: "", role: 1 });

  useEffect(() => {
    const tokenAdmin = localStorage.getItem("tokenAdmin");
    const adminID = localStorage.getItem("admin");
    if (!tokenAdmin || !adminID) {
      store.admin.setData(null);
      Swal.fire({
        title: "Giriş tələb olunur",
        text: "Admin hesabı ilə daxil olun!",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => navigate("/admin/login"));
    } else {
      axios
        .get(Base_Url_Server + "users/" + adminID, {
          headers: { Authorization: `Bearer ${tokenAdmin}` },
        })
        .then((res) => store.admin.setData(res.data.data.user))
        .catch(() => {
          store.admin.setData(null);
          localStorage.removeItem("tokenAdmin");
          localStorage.removeItem("admin");
          Swal.fire({
            title: "Giriş xətası",
            text: "Token etibarsızdır, yenidən daxil olun!",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => navigate("/admin/login"));
        });
    }
  }, []);

  useEffect(() => {
    const tokenAdmin = localStorage.getItem("tokenAdmin");

    axios
      .get(Base_Url_Server + "users", {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      })
      .then((response) => {
        setUsers(response.data.data.users || []);
        setFilteredUsers(response.data.data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Diqqət!",
      text: "İstifadəçini silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      const tokenAdmin = localStorage.getItem("tokenAdmin");

      axios
        .delete(`${Base_Url_Server}users/${id}`, {
          headers: { Authorization: `Bearer ${tokenAdmin}` },
        })
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
          setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
          Swal.fire({
            title: "Uğur ✅",
            text: "İstifadəçi uğurla silindi!",
            icon: "success",
            confirmButtonText: "OK",
          });
        })
        .catch(() => {
          Swal.fire({
            title: "Xəta ❌",
            text: "Silinmə zamanı xəta baş verdi!",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setEditData({ password: "", role: user.role });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = (e) => {
    e.preventDefault();
    const tokenAdmin = localStorage.getItem("tokenAdmin");

    axios
      .patch(`${Base_Url_Server}users/${editingUser.id}`, editData, {
        headers: { Authorization: `Bearer ${tokenAdmin}` },
      })
      .then(() => {
        const newUsers = users.map((user) =>
          user.id === editingUser.id ? { ...user, role: editData.role } : user
        );
        setUsers(newUsers);
        setFilteredUsers(newUsers);
        setEditingUser(null);
        Swal.fire({
          title: "Uğur ✅",
          text: "İstifadəçi redaktə edildi!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch(() => {
        Swal.fire({
          title: "Xəta ❌",
          text: "Redaktə zamanı xəta baş verdi!",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  if (loading) return <p>Yüklənir...</p>;

  return (
    <div className={styles.adminUsers}>
      <div className={styles.header}>
        <h3>İstifadəçiləri idarə et</h3>
        <div className={styles.searchBox}>
          <input
            type="text"
            onChange={(e) => {
              const filteredData = users.filter((user) =>
                user.email
                  .toLocaleUpperCase()
                  .trim()
                  .includes(e.target.value.toLocaleUpperCase().trim())
              );
              setFilteredUsers(filteredData);
            }}
            placeholder="Axtar"
          />
        </div>
      </div>

      <div
        className={styles.editForm}
        style={editingUser ? {} : { height: "0", padding: "0" }}
      >
        <form onSubmit={submitEdit}>
          <input
            type="password"
            name="password"
            value={editData.password}
            onChange={handleEditChange}
            placeholder="Yeni şifrə təyin et"
          />
          <select name="role" value={editData.role} onChange={handleEditChange}>
            <option value={1}>İstifadəçi</option>
            <option value={2}>Admin</option>
            <option value={3}>Super Admin</option>
          </select>
          <div className={styles.buttonGroup}>
            <button type="submit">Yadda saxla</button>
            <button type="button" onClick={() => setEditingUser(null)}>
              Ləğv et
            </button>
          </div>
        </form>
      </div>

      <div className={styles.userList}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Abunəlik</th>
              <th>Yaradılma Tarixi</th>
              <th>Doğrulanmış hesab</th>
              <th>Təhsil email</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr key={user.id}>
                <td>{i + 1}</td>
                <td>{user.email}</td>
                <td>
                  {user.role == 1
                    ? "İstifadəçi"
                    : user.role == 3
                    ? "Super Admin"
                    : "Admin"}
                </td>
                <td>
                  {user.subscriptions[0].plan === "none"
                    ? "yoxdur"
                    : user.subscriptions[0].plan}
                </td>
                <td>{user.createdAt?.split("T")[0]}</td>
                <td>{user.isVerified ? "bəli" : "xeyr"}</td>
                <td>{user.eduEmail ? "bəli" : "xeyr"}</td>
                <td>
                  <Tooltip title="Redaktə et" placement="top">
                    <button onClick={() => openEditForm(user)}>
                      <EditDocumentIcon />
                    </button>
                  </Tooltip>
                  <Tooltip title="Sil" placement="top">
                    <button onClick={() => handleDelete(user.id)}>
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
