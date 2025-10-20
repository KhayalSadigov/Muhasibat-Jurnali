import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Footer from "../../Layouts/Footer";
import bg from "./../../Assets/heroImage.jpg";
import BookIcon from "@mui/icons-material/Book";
import dataContext from "../../Contexts/GlobalState";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import CircularProgress from "@mui/material/CircularProgress";
function LibraryPage() {
  const store = useContext(dataContext);
  const [loader, setLoader] = useState(false);
  const [books, setBooks] = useState(null);
  const [categories, setCategories] = useState(null);

  const [modal, setModal] = useState(null);

  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState("az");
  console.log(store.user.data);
  function handleReset() {
    setSearch("");
    setCategoryId("");
    setStartDate("");
    setEndDate("");
    setMin("");
    setMax("");
    setLanguage("");
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("user");
    if (!token || !userID) {
      store.user.setData(null);
    } else {
      axios
        .get(Base_Url_Server + "users/" + userID, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          store.user.setData(response.data.data.user);
        })
        .catch((error) => {
          store.user.setData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);
  useEffect(() => {
    document.title = "Kitabxana";
  }, []);

  useEffect(() => {
    axios.get(Base_Url_Server + "categories/pdfs").then((res) => {
      setCategories(res.data.data.categories);
    });
  }, []);

  useEffect(() => {
    setLoader(true);
    axios
      .get(
        Base_Url_Server +
          `pdfs?page=${page}&search=${search}&language=${language}&categoryId=${categoryId}&minPrice=${min}&maxPrice=${max}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        setLoader(false);
        setBooks(res.data.data.pdfs);
        setPageCount(res.data.data.pagination.total_pages);
      });
  }, [search, categoryId, min, max, endDate, startDate, page, language]);
  console.log(books);
  return (
    <>
      <section className={styles.library}>
        {modal && (
          <div className={styles.modal}>
            <div
              className={styles.glass}
              onClick={() => {
                setModal(null);
              }}
            ></div>
            <div className={styles.content}>
              <div className={styles.body}>
                <div className={styles.head}>
                  <p>{books && modal && modal?.title}</p>
                  <div className={styles.info}>
                    <span>{modal?.created_at?.split("T")[0]}</span>
                    <span>
                      {modal?.category?.name} |{" "}
                      {modal?.language?.toLocaleUpperCase()}
                    </span>
                  </div>
                </div>
                <div className={styles.text}>
                  <p>{modal?.description}</p>
                </div>
              </div>
              <div className={styles.footer}>
                {store.user.data?.subscriptions[0].plan == "none" ? (
                  <>
                    <button>Bir dəfəlik al</button>
                    <button>Abunəlik əldə et</button>
                  </>
                ) : (
                  <button>Hesabına əlavə et </button>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={styles.hero}>
          <div className={styles.bgImage}>
            <img src={bg} alt="accountant" />
            <h1>Vergi və mühasibatlıq–sənədin hazır, işin asan!</h1>
          </div>
        </div>
        <div className={styles.bookList}>
          <div className={styles.header}>
            <div></div>
            <BookIcon className={styles.icon} />
            <div></div>
          </div>
          <div className={styles.filter}>
            <div
              className={styles.content}
              style={filter ? {} : { height: "60px" }}
            >
              <TuneIcon
                className={styles.iconFilter}
                onClick={() => {
                  setFilter(!filter);
                }}
              />
              <div className={styles.head}>
                <div>
                  <input
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    value={search}
                    type="text"
                    name=""
                    id=""
                    placeholder="Axtar"
                  />
                  <button type="submit">
                    <SearchIcon className={styles.icon} />
                  </button>
                </div>
              </div>
              <form className={styles.dropDown}>
                <div className={styles.date}>
                  <label htmlFor="startDate">Başlanğıc tarix:</label>
                  <input
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                    type="date"
                    id="startDate"
                    placeholder="Bu tarixdən"
                  />
                  {/* <input type="date" id="endDate" placeholder="Bu tarixdən" /> */}
                </div>
                <div className={styles.date}>
                  <label htmlFor="startDate">Son tarix:</label>
                  <input
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                    type="date"
                    id="startDate"
                    placeholder="Bu tarixdən"
                  />
                  {/* <input type="date" id="endDate" placeholder="Bu tarixdən" /> */}
                </div>
                <select
                  onChange={(e) => {
                    setLanguage(e.target.value);
                  }}
                >
                  <option value="">Dil seçimi</option>
                  <option value="az">Azərbaycan</option>
                  <option value="ru">Rusca</option>
                </select>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                  }}
                >
                  <option value="">Kateqoriya</option>
                  {categories &&
                    categories.map((c, i) => {
                      return (
                        <option key={i} value={c.id}>
                          {c?.name}
                        </option>
                      );
                    })}
                </select>
                <input
                  type="number"
                  placeholder="Minimum qiymət"
                  onChange={(e) => {
                    setMin(e.target.value);
                  }}
                />
                <input
                  type="number"
                  placeholder="Maksimum qiymət"
                  onChange={(e) => {
                    setMax(e.target.value);
                  }}
                />
                <button type="reset" onClick={handleReset}>
                  Filterləri təmizlə
                </button>
              </form>
            </div>
          </div>
          <div
            className={styles.container}
            style={loader ? { display: "none" } : {}}
          >
            {books &&
              books?.map((e, i) => {
                return (
                  <div key={e.id} className={styles.card}>
                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <h2>
                          <span>{e.title}</span>{" "}
                          {/* <span>{e.language.toLocaleUpperCase()}</span> */}
                        </h2>
                        <h5>
                          {e.description?.length <= 200
                            ? e.description
                            : e.description?.slice(0, 200) + "..."}
                        </h5>
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.cardInfo}>
                          <span>
                            {e.created_at?.split("T")[0].replaceAll("-", "/")}
                          </span>
                          <span>{e.category?.name}</span>
                        </div>
                        <div className={styles.cardButtons}>
                          <span
                            onClick={() => {
                              setModal(books[i]);
                            }}
                          >
                            <span>PDF-i əldə et</span>
                            <b>{e.price} AZN</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div
            style={loader ? {} : { display: "none" }}
            className={styles.loader}
          >
            <CircularProgress />
          </div>
          <div
            style={pageCount == 1 || pageCount == 0 ? { display: "none" } : {}}
            className={styles.pagination}
          >
            <p
              onClick={() => {
                window.scrollTo(0, 0);

                if (1 < page) {
                  let newPage = page - 1;
                  setPage(newPage);
                } else setPage(pageCount);
              }}
              className={styles.paginationCountArrow}
            >
              {"<"}
            </p>
            <p
              onClick={() => {
                if (page != 1) {
                  setPage(1);
                  window.scrollTo(0, 0);
                }
              }}
              style={
                page == 1 ? { backgroundColor: "#032062", color: "white" } : {}
              }
              className={styles.paginationCount}
            >
              1
            </p>
            <p
              style={pageCount == 2 ? { display: "none" } : {}}
              className={styles.paginationCountDot}
            >
              ...
            </p>
            {page == 1 || page == pageCount ? (
              <p
                style={pageCount == 2 ? { display: "none" } : {}}
                className={styles.paginationCountDot}
              >
                ...
              </p>
            ) : (
              <p
                style={
                  pageCount == 2
                    ? { display: "none" }
                    : { backgroundColor: "#032062", color: "white" }
                }
                className={styles.paginationCount}
              >
                {page}
              </p>
            )}
            <p
              style={pageCount == 2 ? { display: "none" } : {}}
              className={styles.paginationCountDot}
            >
              ...
            </p>
            <p
              onClick={() => {
                if (page != pageCount) {
                  setPage(pageCount);
                  window.scrollTo(0, 0);
                }
              }}
              style={
                page == pageCount
                  ? { backgroundColor: "#032062", color: "white" }
                  : {}
              }
              className={styles.paginationCount}
            >
              {pageCount}
            </p>
            <p
              onClick={() => {
                window.scrollTo(0, 0);
                if (page < pageCount) {
                  let newPage = page + 1;
                  setPage(newPage);
                } else setPage(1);
              }}
              className={styles.paginationCountArrow}
            >
              {">"}
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default LibraryPage;
