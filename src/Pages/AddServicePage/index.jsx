import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Base_Url_Server from "../../Constants/baseUrl";
import axios from "axios";
import dataContext from "../../Contexts/GlobalState";
import { useNavigate } from "react-router-dom";

function AddServicePage() {
  const store = useContext(dataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tokenAdmin = localStorage.getItem("tokenAdmin");
    const adminID = localStorage.getItem("admin");
    if (!tokenAdmin || !adminID) {
      store.admin.setData(null);
      navigate("/admin/login");
    } else {
      axios
        .get(`${Base_Url_Server}users/${adminID}`, {
          headers: { Authorization: `Bearer ${tokenAdmin}` },
        })
        .then((response) => {
          store.admin.setData(response.data.data.user);
        })
        .catch(() => {
          store.admin.setData(null);
          localStorage.removeItem("tokenAdmin");
          localStorage.removeItem("admin");
          navigate("/admin/login");
        });
    }
  }, [navigate, store.admin]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    currency: "AZN",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const tokenAdmin = localStorage.getItem("tokenAdmin");

    try {
      const response = await axios.post(
        `${Base_Url_Server}services`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${tokenAdmin}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Servis uğurla əlavə olundu!");
      setFormData({
        name: "",
        description: "",
        price: 0,
        currency: "AZN",
        is_active: true,
      });
      navigate('/admin/services')
    } catch (error) {

      console.error(error);
      setMessage("❌ Xəta baş verdi, bir daha yoxlayın!");
    } finally {
      setLoading(false);
    }
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Servisin adı..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Servis Haqqında</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Servis haqqında qısa məlumat..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Qiymət</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Məs: 300"
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              Aktiv
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Yüklənir..." : "Əlavə Et"}
          </button>

          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddServicePage;
