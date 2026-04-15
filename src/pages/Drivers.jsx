import { useEffect, useState } from "react";
import API from "../services/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await API.post("/drivers", { name });
      setName("");
      fetchDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Drivers</h1>
      
      <form onSubmit={addDriver}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Driver name"
        />
        <button type="submit">Add Driver</button>
      </form>
      
      <ul>
        {drivers.map(driver => (
          <li key={driver.id}>{driver.name}</li>
        ))}
      </ul>
    </div>
  );
}