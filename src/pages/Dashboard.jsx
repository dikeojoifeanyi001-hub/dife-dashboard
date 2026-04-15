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
      
      {/* Cards container - side by side horizontally */}
      <div style={styles.statsContainer}>
        {/* Card 1: Total Drivers */}
        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Total Drivers</h3>
          <p style={styles.cardValue}>{stats.total_drivers}</p>
        </div>
        
        {/* Card 2: Total Routes */}
        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Total Routes</h3>
          <p style={styles.cardValue}>{stats.total_routes}</p>
        </div>
        
        {/* Card 3: Avg Risk Score */}
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
  statsContainer: {
    display: "flex",           // Forces horizontal layout
    flexDirection: "row",     // Explicitly horizontal
    justifyContent: "center", // Centers cards
    gap: "1.5rem",           // Space between cards
    flexWrap: "wrap",        // Wraps on mobile (responsive)
    marginTop: "1rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "180px",        // Ensures cards have consistent width
    flex: 1,                  // Makes cards equal width
    maxWidth: "250px",        // Prevents cards from being too wide
  },
  cardLabel: {
    fontSize: "1rem",
    color: "#2c3e50",
    marginBottom: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  cardValue: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#0d6efd",
    margin: 0,
  },
};