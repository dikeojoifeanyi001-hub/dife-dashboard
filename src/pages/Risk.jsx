import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function getRiskColor(score) {
  if (score > 70) return "#dc3545";
  if (score > 40) return "#fd7e14";
  return "#28a745";
}

function getRiskLabel(score) {
  if (score > 70) return "High";
  if (score > 40) return "Medium";
  return "Low";
}

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

  const cardStyle = {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    flex: 1,
    minWidth: "180px",
    textAlign: "center",
  };

  if (loading) return <Layout><div style={{ padding: "20px" }}>Loading risk data...</div></Layout>;
  if (error) return <Layout><div style={{ padding: "20px", color: "red" }}>{error}</div></Layout>;

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "30px" }}>Risk Monitor</h1>
        
        {riskData && (
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
            <div style={cardStyle}>
              <h4 style={{ color: "#666", marginBottom: "12px" }}>Total Routes</h4>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{riskData.summary.total_routes}</p>
            </div>
            <div style={cardStyle}>
              <h4 style={{ color: "#666", marginBottom: "12px" }}>High Risk Routes</h4>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc3545", margin: 0 }}>{riskData.summary.high_risk_count}</p>
            </div>
            <div style={cardStyle}>
              <h4 style={{ color: "#666", marginBottom: "12px" }}>Average Risk Score</h4>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0d6efd", margin: 0 }}>{riskData.summary.average_risk_score}</p>
            </div>
          </div>
        )}
        
        <table style={{
          width: "100%",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Origin</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Destination</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Driver</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Risk Score</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {riskData?.data?.map((route, index) => (
              <tr key={route.route_id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{route.origin}</td>
                <td style={{ padding: "12px" }}>{route.destination}</td>
                <td style={{ padding: "12px" }}>{route.driver_name || "N/A"}</td>
                <td style={{ padding: "12px", color: getRiskColor(route.risk_score), fontWeight: "bold" }}>
                  {route.risk_score} ({getRiskLabel(route.risk_score)})
                </td>
                <td style={{ padding: "12px" }}>
                  {getRiskLabel(route.risk_score) === "High" ? "⚠️ Immediate review required" :
                   getRiskLabel(route.risk_score) === "Medium" ? "📊 Monitor closely" : "✅ Normal operations"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {riskData?.data?.length === 0 && <p style={{ textAlign: "center", marginTop: "30px" }}>No routes found. Create routes to see risk analysis.</p>}
      </div>
    </Layout>
  );
}