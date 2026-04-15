import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px", background: "#f5f6fa", overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}