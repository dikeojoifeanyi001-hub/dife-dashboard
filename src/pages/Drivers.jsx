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
      setDrivers(res.data.data || []);
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

  if (loading) return <Layout><div style={{ padding: "20px" }}>Loading drivers...</div></Layout>;
  if (error) return <Layout><div style={{ padding: "20px", color: "red" }}>{error}</div></Layout>;

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>Drivers</h1>
        
        <form onSubmit={addDriver} style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver name"
            style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "6px" }}
            required
          />
          <button type="submit" style={{
            padding: "12px 24px",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>Add Driver</button>
        </form>
        
        {drivers.length === 0 ? (
          <p style={{ padding: "20px", color: "#666", textAlign: "center", background: "white", borderRadius: "8px" }}>
            No drivers available yet. Add your first driver above.
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
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>ID</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Created At</th>
              </td>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{driver.id}</td>
                  <td style={{ padding: "12px" }}>{driver.name}</td>
                  <td style={{ padding: "12px" }}>{new Date(driver.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}