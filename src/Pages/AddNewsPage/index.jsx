import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Base_Url_Server from "../../Constants/baseUrl";
import axios from "axios";
import dataContext from "../../Contexts/GlobalState";
import { useNavigate } from "react-router-dom";

function AddNewsPage() {
  const store = useContext(dataContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
    date: "",
  });
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
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result, // base64 kod buraya gəlir
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      id: Date.now(),
      ...formData,
    };
    console.log("Yeni xəbər:", newData);
    // burada API-yə göndərə bilərsən və ya state-ə əlavə edə bilərsən
  };

  return (
    <div className={styles.addNewsPage}>
      <div className={styles.addNews}>
        <h2>Yeni Xəbər Əlavə Et</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Başlıq</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Məzmun</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Şəkil Faylı</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {formData.image && (
              <div className={styles.preview}>
                <img src={formData.image} alt="preview" />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Kateqoriya</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seçin</option>
              <option value="sport">İdman</option>
              <option value="politics">Siyasət</option>
              <option value="economy">İqtisadiyyat</option>
              <option value="tech">Texnologiya</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tarix</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Əlavə Et</button>
        </form>
      </div>
    </div>
  );
}

export default AddNewsPage;
