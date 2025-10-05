import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Base_Url_Server from "../../Constants/baseUrl";
import axios from "axios";
import dataContext from "../../Contexts/GlobalState";
import { useNavigate } from "react-router-dom";

function AddServicePage() {
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
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    price: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newService = {
      id: Date.now(),
      ...formData,
    };
    console.log("Yeni servis:", newService);
    // Burada API-ə göndərə bilərsən və ya state-də saxlayıb göstərmək olar
  };

  return (
    <div className={styles.addServicePage}>
      <div className={styles.addService}>
        <h2>Yeni Servis Əlavə Et</h2>
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
            <label>Servis Haqqında</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Qiymət</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Məs: 300 AZN"
              required
            />
          </div>

          <button type="submit">Əlavə Et</button>
        </form>
      </div>
    </div>
  );
}

export default AddServicePage;
