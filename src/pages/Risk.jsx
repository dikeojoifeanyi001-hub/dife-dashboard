import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Risk() {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRisk();
  }, []);

  const fetchRisk = async () => {
    try {
      const res = await API.get("/risk");
      setRiskData(res.data);
    } catch (err) {
      setError("Failed to load risk data");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score > 70) return "#dc3545";
    if (score > 40) return "#fd7e14";
    return "#28a745";
  };

  const getRiskLabel = (score) => {
    if (score > 70) return "High";
    if (score > 40) return "Medium";
    return "Low";
  };

  const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: 1,
    textAlign: "center",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const thStyle = {
    padding: "12px 16px",
    textAlign: "left",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #ddd",
  };

  const tdStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
  };

  if (loading) return <Layout><div style={{ padding: "20px" }}>Loading...</div></Layout>;
  if (error) return <Layout><div style={{ padding: "20px", color: "red" }}>{error}</div></Layout>;

  return (
    <Layout>
      <div>
        <h1 style={{ marginBottom: "20px" }}>Risk Monitor</h1>
        
        {riskData && (
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
            <div style={cardStyle}>
              <h3 style={{ color: "#666", marginBottom: "10px" }}>Total Routes</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{riskData.summary.total_routes}</p>
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: "#666", marginBottom: "10px" }}>High Risk Routes</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc3545", margin: 0 }}>{riskData.summary.high_risk_count}</p>
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: "#666", marginBottom: "10px" }}>Average Risk Score</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{riskData.summary.average_risk_score}</p>
            </div>
          </div>
        )}
        
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Origin</th>
              <th style={thStyle}>Destination</th>
              <th style={thStyle}>Driver</th>
              <th style={thStyle}>Risk Score</th>
              <th style={thStyle}>Risk Level</th>
              <th style={thStyle}>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {riskData?.data?.map((route) => (
              <tr key={route.route_id}>
                <td style={tdStyle}>{route.origin}</td>
                <td style={tdStyle}>{route.destination}</td>
                <td style={tdStyle}>{route.driver_name || "N/A"}</td>
                <td style={tdStyle}>{route.risk_score}</td>
                <td style={{ ...tdStyle, color: getRiskColor(route.risk_score), fontWeight: "bold" }}>
                  {getRiskLabel(route.risk_score)}
                </td>
                <td style={tdStyle}>
                  {getRiskLabel(route.risk_score) === "High" ? "⚠️ Immediate review required" :
                   getRiskLabel(route.risk_score) === "Medium" ? "📊 Monitor closely" : "✅ Normal operations"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {riskData?.data?.length === 0 && <p style={{ textAlign: "center", marginTop: "20px" }}>No routes found. Create routes to see risk analysis.</p>}
      </div>
    </Layout>
  );
}