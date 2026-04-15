import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { logout } from "../utils/auth";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, routesRes] = await Promise.all([
        API.get("/drivers"),
        API.get("/routes")
      ]);
      setDrivers(driversRes.data.data || []);
      setRoutes(routesRes.data.data || []);
    } catch (err) {
      setError("Failed to load dashboard data");
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

  const highRisk = routes.filter(r => r.risk_score > 70).length;
  const avgRisk = routes.length > 0 
    ? routes.reduce((sum, r) => sum + r.risk_score, 0) / routes.length 
    : 0;

  const cardStyle = {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    flex: 1,
    minWidth: "180px",
    textAlign: "center",
  };

  if (loading) return <Layout><div style={{ padding: "20px" }}>Loading dashboard data...</div></Layout>;
  if (error) return <Layout><div style={{ padding: "20px", color: "red" }}>{error}</div></Layout>;

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", margin: 0 }}>Dashboard</h1>
          <button onClick={handleLogout} style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>Logout</button>
        </div>
        
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          <div style={cardStyle}>
            <h4 style={{ marginBottom: "8px", fontWeight: "600", color: "#666" }}>Total Drivers</h4>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{drivers.length}</p>
          </div>
          
          <div style={cardStyle}>
            <h4 style={{ marginBottom: "8px", fontWeight: "600", color: "#666" }}>Total Routes</h4>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{routes.length}</p>
          </div>
          
          <div style={cardStyle}>
            <h4 style={{ marginBottom: "8px", fontWeight: "600", color: "#666" }}>High Risk Routes</h4>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "#dc3545", margin: 0 }}>{highRisk}</p>
          </div>
          
          <div style={cardStyle}>
            <h4 style={{ marginBottom: "8px", fontWeight: "600", color: "#666" }}>Avg Risk Score</h4>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{avgRisk.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}