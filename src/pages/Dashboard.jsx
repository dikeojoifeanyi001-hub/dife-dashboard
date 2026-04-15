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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem" }}>
        <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
          <h2>{stats.total_drivers}</h2>
          <p>Total Drivers</p>
        </div>
        <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
          <h2>{stats.total_routes}</h2>
          <p>Total Routes</p>
        </div>
        <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
          <h2>{stats.avg_risk_score}</h2>
          <p>Avg Risk Score</p>
        </div>
      </div>
    </div>
  );
}