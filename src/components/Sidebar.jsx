import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    transition: "all 0.2s",
    display: "block",
  };

  const activeStyle = {
    backgroundColor: "#2f3640",
    borderLeft: "3px solid #0d6efd",
  };

  return (
    <div style={{
      width: "250px",
      background: "#1e272e",
      color: "white",
      padding: "20px 0",
      display: "flex",
      flexDirection: "column",
    }}>
      <h2 style={{ padding: "0 20px", marginBottom: "30px", color: "#fff" }}>DIFE</h2>
      
      <nav style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <NavLink 
          to="/dashboard" 
          style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}
        >
          📊 Dashboard
        </NavLink>
        <NavLink 
          to="/drivers" 
          style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}
        >
          👥 Drivers
        </NavLink>
        <NavLink 
          to="/routes" 
          style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}
        >
          🗺️ Routes
        </NavLink>
        <NavLink 
          to="/risk" 
          style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}
        >
          ⚠️ Risk Monitor
        </NavLink>
      </nav>
    </div>
  );
}