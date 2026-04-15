import { useEffect, useState } from "react";
import API from "../services/api";

export default function Risk() {
  const [risks, setRisks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRisk();
  }, []);

  const fetchRisk = async () => {
    try {
      const res = await API.get("/risk");
      setRisks(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Risk Monitor</h1>
      
      {summary && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <div>Total Routes: {summary.total_routes}</div>
          <div>High Risk: {summary.high_risk_count}</div>
          <div>Avg Risk: {summary.average_risk_score}</div>
        </div>
      )}
      
      <ul>
        {risks.map(risk => (
          <li key={risk.route_id}>
            {risk.origin} → {risk.destination} | 
            Risk Score: {risk.risk_score} | 
            Level: <strong style={{ color: risk.risk_level === "High" ? "red" : risk.risk_level === "Medium" ? "orange" : "green" }}>
              {risk.risk_level}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}