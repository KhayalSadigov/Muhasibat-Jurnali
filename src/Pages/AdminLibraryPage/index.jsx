import styles from "./index.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import dataContext from "../../Contexts/GlobalState";

function AdminLibraryPage() {
  const navigate = useNavigate();
  const store = useContext(dataContext);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    categoryId: "",
    price: "",
    language: "",
  });
  const [loading, setLoading] = useState(true);

  // Admin auth yoxlanışı
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

  // Kitablar və kateqoriyalar
  useEffect(() => {
    const getData = async () => {
      try {
        const [pdfRes, catRes] = await Promise.all([
          axios.get("https://api.muhasibatjurnal.az/pdfs"),
          axios.get("https://api.muhasibatjurnal.az/categories/pdfs"),
        ]);
        setBooks(pdfRes.data.data.pdfs || []);
        setFilteredBooks(pdfRes.data.data.pdfs || []);
        setCategories(catRes.data.data.categories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // DELETE
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Kitabı silmək istədiyinizə əminsiniz?"
    );
    if (!confirmDelete) return;

    const tokenAdmin = localStorage.getItem("tokenAdmin");

    axios
      .delete(`${Base_Url_Server}pdfs/${id}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` },
      })
      .then(() => {
        const updated = books.filter((b) => b.id !== id);
        setBooks(updated);
        setFilteredBooks(updated);
        alert("Kitab uğurla silindi!");
      })
      .catch(() => alert("Silinmə zamanı xəta baş verdi!"));
  };

  // EDIT
  const openEditForm = (book) => {
    setEditingBook(book);
    setEditData({
      title: book.title,
      description: book.description,
      categoryId: book.category.id,
      price: book.price,
      language: book.language,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value })); // düz variant
  };

  const submitEdit = (e) => {
    console.log(editData);
    e.preventDefault();
    const tokenAdmin = localStorage.getItem("tokenAdmin");
    console.log(editingBook);
    axios
      .put(`${Base_Url_Server}pdfs/${editingBook.id}`, editData, {
        headers: { Authorization: `Bearer ${tokenAdmin}` },
      })
      .then(async () => {
        axios.get("https://api.muhasibatjurnal.az/pdfs").then((res) => {
          setBooks(res.data.data.pdfs || []);
          setFilteredBooks(res.data.data.pdfs || []);
          setEditingBook(null);
          alert("Kitab uğurla redaktə olundu!");
        });
      })
      .catch(() => alert("Redaktə zamanı xəta baş verdi!"));
  };

  if (loading) return <p>Yüklənir...</p>;

  return (
    <div className={styles.adminBooks}>
      <div className={styles.header}>
        <h3>Kitabları idarə et</h3>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Axtar"
            onChange={(e) => {
              const val = e.target.value.toLowerCase();
              const filtered = books.filter((book) =>
                book.title.toLowerCase().includes(val)
              );
              setFilteredBooks(filtered);
            }}
          />
        </div>
        <button onClick={() => navigate("/admin/add-book")}>
          <AddCircleOutlineIcon /> Əlavə et
        </button>
      </div>

      {/* Edit Form */}
      <div
        className={styles.editForm}
        style={editingBook ? {} : { maxHeight: "0", padding: "0" }}
      >
        <form onSubmit={submitEdit} style={editingBook ? { opacity: "1" } : {}}>
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            placeholder="Başlıq"
            required
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            placeholder="Təsvir"
            rows={3}
          />
          <select
            name="categoryId"
            value={editData.categoryId}
            onChange={handleEditChange}
          >
            <option value="">Kateqoriya seç</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="price"
            value={editData.price}
            onChange={handleEditChange}
            placeholder="Qiymət"
          />

          {/* DİL SELECTİ */}
          <select
            name="language"
            value={editData.language}
            onChange={handleEditChange}
          >
            <option value="">Dil seç</option>
            <option value="az">Azərbaycan dili</option>
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>

          <div className={styles.buttonGroup}>
            <button type="submit">Yadda saxla</button>
            <button type="button" onClick={() => setEditingBook(null)}>
              Ləğv et
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className={styles.bookList}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlıq</th>
              <th>Açıqlama</th>
              <th>Dil</th>
              <th>Qiymət</th>
              <th>Kateqoriya</th>
              <th>Demo</th>
              <th>Yüklənmə sayı</th>
              <th>Yaradılma tarixi</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book, i) => (
              <tr key={book.id}>
                <td>{i + 1}</td>
                <td className={styles.title}>{book.title}</td>
                <td className={styles.title}>{book.description}</td>
                <td>{book.language}</td>
                <td>{book.price}</td>
                <td>{book.category.name}</td>
                <td>
                  <a
                    href={
                      Base_Url_Server +
                      book.file_path.split(
                        "/home/muhasibatjurnal/backend-mmu/"
                      )[1]
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Demo
                  </a>
                </td>
                <td>{book.downloads}</td>
                <td>{book.created_at.split("T")[0]}</td>
                <td>
                  <Tooltip title="Redaktə et" placement="top">
                    <button onClick={() => openEditForm(book)}>
                      <EditDocumentIcon />
                    </button>
                  </Tooltip>
                  <Tooltip title="Sil" placement="top">
                    <button onClick={() => handleDelete(book.id)}>
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

export default AdminLibraryPage;
