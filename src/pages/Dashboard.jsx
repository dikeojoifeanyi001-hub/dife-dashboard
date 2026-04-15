import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_drivers: 0, total_routes: 0, avg_risk_score: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/companies/stats");
      setStats(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "#1a1a2e" }}>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
      
      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Total Drivers</h3>
          <p style={styles.cardValue}>{stats.total_drivers}</p>
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Total Routes</h3>
          <p style={styles.cardValue}>{stats.total_routes}</p>
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Avg Risk Score</h3>
          <p style={styles.cardValue}>{stats.avg_risk_score}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  logoutBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginTop: "1rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  cardLabel: {
    fontSize: "1.2rem",
    color: "#2c3e50",
    marginBottom: "0.75rem",
    fontWeight: "600",
  },
  cardValue: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#0d6efd",
    margin: 0,
  },
};