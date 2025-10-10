import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import dataContext from "../../Contexts/GlobalState";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";

function AddBookPage() {
  const store = useContext(dataContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "", // ✅ Yeni sahə
    language: "az",
    price: "",
    categoryId: "",
    file: null,
  });

  const [categories, setCategories] = useState([]);

  // input dəyişiklikləri
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // fayl seçimi
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file,
    });
  };

  // forma göndərilməsi
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const tokenAdmin = localStorage.getItem("tokenAdmin");
      if (!tokenAdmin) {
        alert("Token tapılmadı, yenidən daxil olun.");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description); // ✅ Backend-ə göndərilir
      data.append("language", formData.language);
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);
      data.append("file", formData.file);

      const res = await axios.post("https://api.muhasibatjurnal.az/pdfs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${tokenAdmin}`,
        },
      });

      alert("Kitab uğurla əlavə olundu!");
      console.log("Server response:", res.data);
      navigate("/admin/library");
    } catch (err) {
      console.error("Xəta:", err);
      alert("Əlavə etmə zamanı xəta baş verdi.");
    }
  };

  // admin login yoxlanışı
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
        })
        .catch(() => {
          navigate("/admin/login");
          store.admin.setData(null);
          localStorage.removeItem("tokenAdmin");
          localStorage.removeItem("admin");
        });
    }
  }, []);

  // kateqoriyaları gətir
  useEffect(() => {
    axios
      .get("https://api.muhasibatjurnal.az/categories/pdfs")
      .then((res) => {
        setCategories(res.data.data.categories);
      })
      .catch((err) => console.error("Kateqoriyalar alınmadı:", err));
  }, []);

  return (
    <div className={styles.addBookPage}>
      <div className={styles.addBook}>
        <h2>Yeni Kitab Əlavə Et</h2>
        <form onSubmit={handleSubmit}>
          {/* Başlıq */}
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

          {/* Təsvir */}
          <div className={styles.formGroup}>
            <label>Təsvir</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Kitab haqqında qısa təsvir yazın..."
              required
            ></textarea>
          </div>

          {/* Dil */}
          <div className={styles.formGroup}>
            <label>Dil</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="az">az</option>
              <option value="en">en</option>
              <option value="ru">ru</option>
            </select>
          </div>

          {/* Qiymət */}
          <div className={styles.formGroup}>
            <label>Qiymət</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Məs: 20"
              required
            />
          </div>

          {/* Kateqoriya */}
          <div className={styles.formGroup}>
            <label>Kateqoriya</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Kateqoriya seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* PDF Faylı */}
          <div className={styles.formGroup}>
            <label>PDF Faylı</label>
            <input type="file" onChange={handleFileChange} required />
            {formData.file && <p>Seçilən fayl: {formData.file.name}</p>}
          </div>

          <button type="submit">Əlavə Et</button>
        </form>
      </div>
    </div>
  );
}

export default AddBookPage;
