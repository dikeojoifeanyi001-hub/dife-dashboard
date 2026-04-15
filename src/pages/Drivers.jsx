import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data.data);
    } catch (err) {
      setError("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await API.post("/drivers", { name });
      setDrivers([...drivers, res.data.data]);
      setName("");
    } catch (err) {
      setError("Failed to add driver");
    }
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
        <h1 style={{ marginBottom: "20px" }}>Drivers</h1>
        
        <form onSubmit={addDriver} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver name"
            style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          />
          <button type="submit" style={{
            padding: "10px 20px",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>Add Driver</button>
        </form>
        
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td style={tdStyle}>{driver.id}</td>
                <td style={tdStyle}>{driver.name}</td>
                <td style={tdStyle}>{new Date(driver.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {drivers.length === 0 && <p style={{ textAlign: "center", marginTop: "20px" }}>No drivers yet. Add your first driver above.</p>}
      </div>
    </Layout>
  );
}