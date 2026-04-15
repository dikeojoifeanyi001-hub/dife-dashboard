import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ origin: "", destination: "", driverId: "" });

  useEffect(() => {
    fetchRoutes();
    fetchDrivers();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await API.get("/routes");
      setRoutes(res.data.data);
    } catch (err) {
      setError("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addRoute = async (e) => {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.driverId) {
      setError("All fields are required");
      return;
    }
    try {
      await API.post("/routes", form);
      setForm({ origin: "", destination: "", driverId: "" });
      setError(null);
      fetchRoutes();
    } catch (err) {
      setError("Failed to add route");
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

  return (
    <Layout>
      <div>
        <h1 style={{ marginBottom: "20px" }}>Routes</h1>
        
        <form onSubmit={addRoute} style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Origin"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
            style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          />
          <input
            type="text"
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          />
          <select
            value={form.driverId}
            onChange={(e) => setForm({ ...form, driverId: e.target.value })}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          >
            <option value="">Select Driver</option>
            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button type="submit" style={{
            padding: "10px 20px",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>Add Route</button>
        </form>
        
        {error && <div style={{ backgroundColor: "#fee", color: "#c00", padding: "10px", borderRadius: "6px", marginBottom: "20px" }}>{error}</div>}
        
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Origin</th>
              <th style={thStyle}>Destination</th>
              <th style={thStyle}>Driver</th>
              <th style={thStyle}>Risk Score</th>
              <th style={thStyle}>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td style={tdStyle}>{route.origin}</td>
                <td style={tdStyle}>{route.destination}</td>
                <td style={tdStyle}>{route.driver_name || "N/A"}</td>
                <td style={tdStyle}>{route.risk_score}</td>
                <td style={{ ...tdStyle, color: getRiskColor(route.risk_score), fontWeight: "bold" }}>
                  {getRiskLabel(route.risk_score)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {routes.length === 0 && <p style={{ textAlign: "center", marginTop: "20px" }}>No routes yet. Add your first route above.</p>}
      </div>
    </Layout>
  );
}