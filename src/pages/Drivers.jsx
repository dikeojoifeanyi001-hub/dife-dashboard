import { useEffect, useState } from "react";
import API from "../services/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await API.post("/drivers", { name });
      setName("");
      fetchDrivers();
    } catch (err) {
      setError("Failed to add driver");
    }
  };

  if (loading) return <div style={styles.loading}>Loading drivers...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Drivers</h1>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={addDriver} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter driver name"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Driver</button>
      </form>
      
      {drivers.length === 0 ? (
        <p style={styles.empty}>No drivers yet. Add your first driver above.</p>
      ) : (
        <div style={styles.driversList}>
          {drivers.map(driver => (
            <div key={driver.id} style={styles.driverCard}>
              <span style={styles.driverName}>{driver.name}</span>
              <span style={styles.driverDate}>Added: {new Date(driver.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  driversList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  driverCard: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverName: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
  },
  driverDate: {
    fontSize: "0.85rem",
    color: "#888",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c00",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    fontSize: "1.2rem",
    color: "#666",
  },
  empty: {
    textAlign: "center",
    padding: "2rem",
    color: "#888",
  },
};