import { useEffect, useState } from "react";
import API from "../services/api";

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error(err);
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
    try {
      await API.post("/routes", form);
      setForm({ origin: "", destination: "", driverId: "" });
      fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Routes</h1>
      
      <form onSubmit={addRoute}>
        <input
          type="text"
          placeholder="Origin"
          value={form.origin}
          onChange={(e) => setForm({ ...form, origin: e.target.value })}
        />
        <input
          type="text"
          placeholder="Destination"
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
        />
        <select
          value={form.driverId}
          onChange={(e) => setForm({ ...form, driverId: e.target.value })}
        >
          <option value="">Select Driver</option>
          {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button type="submit">Add Route</button>
      </form>
      
      <ul>
        {routes.map(route => (
          <li key={route.id}>{route.origin} → {route.destination} (Risk: {route.risk_score})</li>
        ))}
      </ul>
    </div>
  );
}