import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const SidebarOwner = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const menu = [
    { label: "Dashboard", path: "/owner/dashboard", icon: "📊" },
    { label: "Produk", path: "/owner/produk", icon: "📦" },
    { label: "Transaksi", path: "/owner/transaksi", icon: "🧾" },
    { label: "Stok", path: "/owner/stok", icon: "📉" },
    { label: "Laporan", path: "/owner/laporan", icon: "📈" },
    { label: "Pengaturan", path: "/owner/pengaturan", icon: "⚙️" },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* BRAND */}
      <div style={styles.brand}>
        <strong>TokoWarung</strong>
        <span style={styles.brandSub}>Owner Panel</span>
      </div>

      {/* MENU */}
      <nav style={styles.nav}>
        {menu.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? "#1e293b" : "transparent",
              color: isActive ? "#fff" : "#cbd5f5",
            })}
          >
            <span style={styles.icon}>{m.icon}</span>
            {m.label}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div style={styles.footer}>
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SidebarOwner;

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    width: 240,
    background: "#020617",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  brand: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid #1e293b",
    fontSize: 18,
  },
  brandSub: {
    display: "block",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  nav: {
    flex: 1,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 14,
    transition: "all 0.2s",
  },
  icon: {
    width: 20,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    borderTop: "1px solid #1e293b",
  },
  logout: {
    width: "100%",
    padding: "10px 12px",
    background: "#ef4444",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
