import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import axios from "axios";
import Base_Url_Server from "../../Constants/baseUrl";
import dataContext from "../../Contexts/GlobalState";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminHomePage() {
  const store = useContext(dataContext);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const tokenAdmin = localStorage.getItem("tokenAdmin");
  const adminID = localStorage.getItem("admin");
  console.log(dashboard);
  const calcMonthlyRevenue = () => {
    let total = 0;
    dashboard?.monthlyRevenue?.forEach((e) => {
      total = total + e.amount;
    });
    return total;
  };

  useEffect(() => {
    if (!tokenAdmin || !adminID) {
      store.admin.setData(null);
      navigate("/admin/login");
      return;
    }

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
  }, [tokenAdmin, adminID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes] = await Promise.all([
          axios.get(Base_Url_Server + "admin/dashboard", {
            headers: { Authorization: `Bearer ${tokenAdmin}` },
          }),
        ]);
        setDashboard(dashboardRes.data.data);
      } catch (err) {
        console.log("Dashboard yüklənmədi:", err);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, [tokenAdmin]);
  const chartSetting = {
    xAxis: [
      {
        label: "rainfall (mm)",
      },
    ],
    height: 400,
    margin: { left: 0 },
  };
  if (loader) return <CircularProgress className={styles.loader} />;

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <h3>Ümumi İstifadəçi</h3>
          <p>{dashboard?.totalUsers}</p>
        </div>
        <div className={styles.statBox}>
          <h3>Aktiv Abunələr</h3>
          <p>{dashboard?.activeSubscriptions}</p>
        </div>
        <div className={styles.statBox}>
          <h3>Ümumi Gəlir</h3>
          <p>{calcMonthlyRevenue()} AZN</p>
        </div>
        <div className={styles.statBox}>
          <h3>Toplam PDF sayı</h3>
          <p>{dashboard?.totalPdfs}</p>
        </div>
      </div>
      <div className={styles.monthlyStats}>
        <div className={styles.monthBox}>
          <h3>Aylıq gəlirlər</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={dashboard?.monthlyRevenue}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => [`${v} AZN`, "Məbləğ"]} />
                <Bar dataKey="amount" fill="#334155" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className={styles.categoryStats}>
        <h3>PDF statistikaları</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>№</th>
              <th>Kateqoriya</th>
              <th>PDF Sayı</th>
              <th>Yüklənmələr</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.categoryStats?.map((cat, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.pdfCount}</td>
                <td>{cat.totalDownloads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminHomePage;
