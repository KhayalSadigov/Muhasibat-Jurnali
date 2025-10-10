import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import dataContext from "../../Contexts/GlobalState";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import { useNavigate } from "react-router-dom";

function ProfilPage() {
  const store = useContext(dataContext);
  const user = store?.user.data;
  console.log(user)
  const navigate = useNavigate();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("user");
    if (!token || !userID) {
      store.user.setData(null);
      navigate("/login");
    } else {
      axios
        .get(Base_Url_Server + "users/" + userID, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          store.user.setData(response.data.data.user);
        })
        .catch(() => {
          store.user.setData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        });
    }
  }, []);

  const handleLogout = () => {
    store.user.setData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.newPassword !== form.confirmPassword) {
      setMessage("Yeni şifrələr uyğun deyil!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("user");
      const response = await axios.patch(
        `${Base_Url_Server}users/${userID}`,
        {
          password: form.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Şifrə uğurla dəyişdirildi ✅");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Xəta baş verdi, yenidən cəhd edin!"
      );
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <img
          src={`https://ui-avatars.com/api/?name=${user?.email || "Profil"}`}
          alt="Profil"
          className={styles.avatar}
        />
        <p className={styles.email}>{user?.email || "email@example.com"}</p>
        <div className={styles.details}>
          <p>
            <strong>Təhsil Email:</strong> {user?.eduEmail ? "Bəli" : "Xeyr"}
          </p>
        </div>

        <button
          className={styles.changePasswordButton}
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? "Bağla" : "Şifrəni dəyiş"}
        </button>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className={styles.passwordForm}>
            <input
              type="password"
              placeholder="Köhnə şifrə"
              value={form.oldPassword}
              onChange={(e) =>
                setForm({ ...form, oldPassword: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Yeni şifrə"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Yeni şifrəni təsdiqlə"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
            <button type="submit" className={styles.savePasswordButton}>
              Yadda saxla
            </button>
            {message && <p className={styles.message}>{message}</p>}
          </form>
        )}

        <button className={styles.logoutButton} onClick={handleLogout}>
          Hesabdan çıxış
        </button>
      </div>
    </div>
  );
}

export default ProfilPage;
