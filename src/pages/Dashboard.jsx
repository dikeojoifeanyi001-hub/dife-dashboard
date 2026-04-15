import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { logout } from "../utils/auth";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_drivers: 0, total_routes: 0, avg_risk_score: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/companies/stats");
      setStats(res.data.data);
    } catch (err) {
      setError("Failed to load stats");
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

  const cardStyle = {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: 1,
    minWidth: "180px",
    textAlign: "center",
  };

  if (loading) return <Layout><div style={{ padding: "20px" }}>Loading...</div></Layout>;
  if (error) return <Layout><div style={{ padding: "20px", color: "red" }}>{error}</div></Layout>;

  return (
    <Layout>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <button onClick={handleLogout} style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>Logout</button>
        </div>
        
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#666", marginBottom: "12px" }}>Total Drivers</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{stats.total_drivers}</p>
          </div>
          
          <div style={cardStyle}>
            <h3 style={{ color: "#666", marginBottom: "12px" }}>Total Routes</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{stats.total_routes}</p>
          </div>
          
          <div style={cardStyle}>
            <h3 style={{ color: "#666", marginBottom: "12px" }}>Avg Risk Score</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{stats.avg_risk_score}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}