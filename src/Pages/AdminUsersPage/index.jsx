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

function AdminUsersPage() {
  const navigate = useNavigate();
  const store = useContext(dataContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null); // Redaktə olunan istifadəçi
  const [editData, setEditData] = useState({ password: "", role: 1 });

  useEffect(() => {
    const tokenAdmin = localStorage.getItem("tokenAdmin");
    const adminID = localStorage.getItem("admin");
    if (!tokenAdmin || !adminID) {
      store.admin.setData(null);
      navigate("/admin/login");
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
          navigate("/admin/login");
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

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "İstifadəçini silmək istədiyinizə əminsiniz?"
    );
    if (!confirmDelete) return;

    const tokenAdmin = localStorage.getItem("tokenAdmin");

    axios
      .delete(`${Base_Url_Server}users/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        alert("İstifadəçi uğurla silindi!");
      })
      .catch(() => {
        alert("Silinmə zamanı xəta baş verdi!");
      });
  };

  // Edit funksiyaları
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
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      })
      .then((res) => {
        // Local state-i güncəlləyirik
        const newUsers = users.map((user) => {
          return user.id === editingUser.id
            ? { ...user, role: editData.role }
            : user;
        });
        // console.log(editingUser.id ? { ...user, role: editData.role } : user)
        setUsers(newUsers);
        setFilteredUsers(newUsers);
        console.log(users);
        console.log(users[0].role);
        console.log(editData.role);

        setEditingUser(null);
      })
      .catch(() => {
        alert("Redaktə zamanı xəta baş verdi!");
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
              const filteredData = users.filter((user) => {
                return user.email
                  .toLocaleUpperCase()
                  .trim()
                  .includes(e.target.value.toLocaleUpperCase().trim());
              });
              setFilteredUsers(filteredData);
            }}
            placeholder="Axtar"
          />
        </div>
      </div>

      {/* Edit form */}
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
