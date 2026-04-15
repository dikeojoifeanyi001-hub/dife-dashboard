import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_drivers: 0, total_routes: 0, avg_risk_score: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/companies/stats");
      setStats(res.data.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch stats", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          logout();
          navigate("/");
        }, 2000);
      } else {
        setError("Failed to load statistics");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total_drivers}</div>
          <div style={styles.statLabel}>Total Drivers</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total_routes}</div>
          <div style={styles.statLabel}>Total Routes</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.avg_risk_score}</div>
          <div style={styles.statLabel}>Avg Risk Score</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    margin: 0,
  },
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
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  },
  statCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  statNumber: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    color: "#1a73e8",
    marginBottom: "0.5rem",
    lineHeight: "1.2",
  },
  statLabel: {
    fontSize: "1.1rem",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    fontSize: "1.2rem",
    color: "#666",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c00",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    textAlign: "center",
  },
};