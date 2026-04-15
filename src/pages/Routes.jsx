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
      setRoutes(res.data.data || []);
    } catch (err) {
      setError("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data.data || []);
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

  if (loading) return <Layout><div style={{ padding: "20px" }}>Loading routes...</div></Layout>;

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>Routes</h1>
        
        <form onSubmit={addRoute} style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Origin"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
            style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          />
          <input
            type="text"
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          />
          <select
            value={form.driverId}
            onChange={(e) => setForm({ ...form, driverId: e.target.value })}
            style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          >
            <option value="">Select Driver</option>
            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button type="submit" style={{
            padding: "12px 24px",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>Add Route</button>
        </form>
        
        {error && <div style={{ backgroundColor: "#fee", color: "#c00", padding: "12px", borderRadius: "6px", marginBottom: "20px" }}>{error}</div>}
        
        {routes.length === 0 ? (
          <p style={{ padding: "20px", color: "#666", textAlign: "center", background: "white", borderRadius: "8px" }}>
            No routes available yet. Add your first route above.
          </p>
        ) : (
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
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{route.origin}</td>
                  <td style={{ padding: "12px" }}>{route.destination}</td>
                  <td style={{ padding: "12px" }}>{route.driver_name || "N/A"}</td>
                  <td style={{ padding: "12px", color: getRiskColor(route.risk_score), fontWeight: "bold" }}>
                    {route.risk_score} ({getRiskLabel(route.risk_score)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}