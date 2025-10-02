import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import userData from "../../Data/userData";

function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    subscription: "",
  });

  const loggedInUserId = 1; // Simulyasiya üçün login user

  useEffect(() => {
    const user = userData.find((u) => u.id === loggedInUserId);
    if (user) {
      setCurrentUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        subscription: user.subscription,
      });
    }
  }, []);

  if (!currentUser) return <p>Yüklənir...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, ...formData };
    setCurrentUser(updatedUser);
    setIsEditing(false);
    console.log("Yenilənmiş istifadəçi:", updatedUser);
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h2>Profil Məlumatları</h2>
        <form onSubmit={handleSave} className={styles.infoForm}>
          <div className={styles.formGroup}>
            <label>İstifadəçi Adı</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Şifrə</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Rol</label>
            <input type="text" value={formData.role} readOnly />
          </div>

          <div className={styles.formGroup}>
            <label>Abunəlik</label>
            <input type="text" value={formData.subscription} readOnly />
          </div>

          <div className={styles.buttons}>
            {!isEditing ? (
              <span type="button" onClick={() => {
                console.log("yes")
                setIsEditing(true)}}>
                Redaktə et
              </span>
            ) : (
              <button type="submit">Yadda saxla</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
