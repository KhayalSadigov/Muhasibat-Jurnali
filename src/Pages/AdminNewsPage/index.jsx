import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import dataContext from "../../Contexts/GlobalState";
import Swal from "sweetalert2";

function AdminNewsPage() {
  const store = useContext(dataContext);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formDataEdit, setFormDataEdit] = useState({
    title: "",
    content: "",
    categoryId: "",
    language: "az",
    image: null,
  });
  const [loader, setLoader] = useState(false);

  // Admin yoxlaması
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
        .then((res) => store.admin.setData(res.data.data.user))
        .catch(() => {
          store.admin.setData(null);
          localStorage.removeItem("tokenAdmin");
          localStorage.removeItem("admin");
          navigate("/admin/login");
        });
    }
  }, []);

  // Fetch data
  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${Base_Url_Server}news`);
      const data = res.data.data.news;
      setNews(data);
      setFilteredNews(data);
    } catch (err) {
      console.log("Xəbərlər yüklənmədi:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${Base_Url_Server}categories`);
      setCategories(res.data.data.categories);
    } catch (err) {
      console.log("Kateqoriyalar yüklənmədi:", err);
    }
  };

  // Axtarış funksiyası
  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = news.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.content.toLowerCase().includes(value.toLowerCase()) ||
        item.category?.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNews(filtered);
  };

  // Silmə funksiyası
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Silmək istədiyinizdən əminsiniz?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        const tokenAdmin = localStorage.getItem("tokenAdmin");
        await axios.delete(`${Base_Url_Server}news/${id}`, {
          headers: { Authorization: `Bearer ${tokenAdmin}` },
        });
        setNews(news.filter((n) => n.id !== id));
        setFilteredNews(filteredNews.filter((n) => n.id !== id));
        Swal.fire("Silindi!", "Xəbər uğurla silindi.", "success");
      } catch (err) {
        Swal.fire("Xəta!", "Xəbər silinə bilmədi.", "error");
      }
    }
  };

  // Redaktə başlatmaq
  const handleEditStart = (item) => {
    setEditId(item.id);
    setFormDataEdit({
      title: item.title,
      content: item.content,
      categoryId: item.category?.id || "",
      language: item.language || "az",
      image: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormDataEdit((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormDataEdit((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const tokenAdmin = localStorage.getItem("tokenAdmin");
      const formData = new FormData();
      formData.append("title", formDataEdit.title);
      formData.append("content", formDataEdit.content);
      formData.append("categoryId", formDataEdit.categoryId);
      formData.append("language", formDataEdit.language);
      if (formDataEdit.image) formData.append("image", formDataEdit.image);

      await axios.put(`${Base_Url_Server}news/${editId}`, formData, {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoader(false);
      setEditId(null);
      Swal.fire("Uğur ✅", "Xəbər uğurla yeniləndi!", "success");
      fetchNews();
    } catch (err) {
      setLoader(false);
      Swal.fire(
        "Xəta ❌",
        err.response?.data?.message || "Yenilənmədi",
        "error"
      );
    }
  };

  return (
    <div className={styles.adminNews}>
      <div className={styles.header}>
        <h3>Xəbərləri idarə et</h3>

        {/* 🔍 Axtarış */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Başlıq, kateqoriya və ya kontent üzrə axtar..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <button onClick={() => navigate("/admin/add-news")}>
          <AddCircleOutlineIcon /> Əlavə et
        </button>
      </div>

      {editId && (
        <form className={styles.editForm} onSubmit={handleEditSubmit}>
          <div className={styles.inputGroup}>
            <label>Başlıq</label>
            <input
              type="text"
              name="title"
              value={formDataEdit.title}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Kontent</label>
            <textarea
              name="content"
              value={formDataEdit.content}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Kateqoriya</label>
            <select
              name="categoryId"
              value={formDataEdit.categoryId}
              onChange={handleEditChange}
              required
            >
              <option value="">Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Dil</label>
            <select
              name="language"
              value={formDataEdit.language}
              onChange={handleEditChange}
              required
            >
              <option value="az">AZ</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Mövcud Şəkil</label>
            <img
              src={
                Base_Url_Server +
                news
                  .find((n) => n.id === editId)
                  ?.image?.split("/home/muhasibatjurnal/backend-mmu/")[1]
              }
              alt="current"
              style={{
                width: "100px",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            />
          </div>

          <div className={styles.buttonsWrapper}>
            <button type="submit" disabled={loader}>
              {loader ? "Yüklənir..." : "Yenilə"}
            </button>
            <button
              type="button"
              style={{ background: "#d64545" }}
              onClick={() => setEditId(null)}
            >
              Ləğv et
            </button>
          </div>
        </form>
      )}

      <div className={styles.newsList}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Şəkil</th>
              <th>Başlıq</th>
              <th>Dil</th>
              <th>Kateqoriya</th>
              <th>Kontent</th>
              <th>Tarix</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((n, i) => (
              <tr key={n.id}>
                <td>{i + 1}</td>
                <td>
                  {n.image ? (
                    <img
                      src={
                        Base_Url_Server +
                        n.image.split("/home/muhasibatjurnal/backend-mmu/")[1]
                      }
                      alt="news"
                      style={{ width: "80px", borderRadius: "6px" }}
                    />
                  ) : (
                    "Şəkil yoxdur"
                  )}
                </td>
                <td>{n.title}</td>
                <td>{n.language}</td>
                <td>{n.category.name}</td>
                <td>{n.content}</td>
                <td>{n.created_at.split("T")[0]}</td>
                <td>
                  <Tooltip title="Redaktə et">
                    <button onClick={() => handleEditStart(n)}>
                      <EditDocumentIcon />
                    </button>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <button onClick={() => handleDelete(n.id)}>
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

export default AdminNewsPage;
  