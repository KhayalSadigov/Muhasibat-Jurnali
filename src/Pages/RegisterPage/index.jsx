import React, { useState, useContext } from "react";
import styles from "./index.module.scss";
import bg from "./../../Assets/heroImage.jpg";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import dataContext from "../../Contexts/GlobalState";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const store = useContext(dataContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const formReset = () => {
    setForm({ email: "", password: "" });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(Base_Url_Server + "auth/register", form)
      .then((response) => {
        const { user, token } = response.data.data;

        if (!user || !token) {
          setError("Qeydiyyat uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user.id));
        store.user.setData(user);
        formReset();

        navigate("/");
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
        }
      });
  };

  return (
    <div className={styles.container}>
      <img src={bg} alt="" />
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Qeydiyyat</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Şifrə"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
          required
        />

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.button}>
          Hesab yarat
        </button>

        <p className={styles.registerText}>
          Artıq hesabınız var?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={styles.registerBtn}
          >
            Daxil ol
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
