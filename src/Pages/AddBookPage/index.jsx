import { useState } from "react";
import styles from "./index.module.scss";

function AddBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    cover: "",
    demo: "",
  });

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
          cover: reader.result, // şəkil base64 formatında
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = {
      id: Date.now(),
      ...formData,
    };
    console.log("Yeni kitab:", newBook);
    // burda API-ə göndərə və ya state-ə əlavə edə bilərsən
  };

  return (
    <div className={styles.addBookPage}>
      <div className={styles.addBook}>
        <h2>Yeni Kitab Əlavə Et</h2>
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
            <label>Açıqlama</label>
            <textarea
              name="desc"
              value={formData.desc}
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
              placeholder="Məs: $20"
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
            {formData.cover && (
              <div className={styles.preview}>
                <img src={formData.cover} alt="preview" />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Demo Link</label>
            <input
              type="url"
              name="demo"
              value={formData.demo}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <button type="submit">Əlavə Et</button>
        </form>
      </div>
    </div>
  );
}

export default AddBookPage;
