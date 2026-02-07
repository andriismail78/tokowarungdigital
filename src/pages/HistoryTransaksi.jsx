import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

const rp = (n) => new Intl.NumberFormat("id-ID").format(n);

const HistoryTransaksi = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftTotal, setShiftTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const kasirId = auth.user.id;
      const today = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("transaksi")
        .select("id,total,created_at")
        .eq("kasir_id", kasirId)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`)
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setRows(data || []);

      const sum = (data || []).reduce(
        (s, t) => s + Number(t.total),
        0
      );
      setShiftTotal(sum);

      setLoading(false);
    };

    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={{ marginBottom: 16 }}>Kasir</h2>

        <button
          style={navStyle(location.pathname === "/dashboard/kasir")}
          onClick={() => navigate("/dashboard/kasir")}
        >
          🧾 Transaksi
        </button>

        <button
          style={navStyle(location.pathname === "/dashboard/kasir/history")}
          onClick={() => navigate("/dashboard/kasir/history")}
        >
          📜 History
        </button>

        <div style={styles.shiftBox}>
          <div>Total Hari Ini</div>
          <strong>Rp {rp(shiftTotal)}</strong>
        </div>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main style={styles.main}>
        <h1>History Transaksi</h1>

        {loading && <p>Memuat data…</p>}

        {!loading && rows.length === 0 && (
          <p>Tidak ada transaksi hari ini</p>
        )}

        {rows.map((t) => (
          <div key={t.id} style={styles.card}>
            <strong>Rp {rp(t.total)}</strong>
            <div style={styles.time}>
              {new Date(t.created_at).toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

const navStyle = (active) => ({
  width: "100%",
  textAlign: "left",
  padding: 10,
  marginBottom: 6,
  borderRadius: 6,
  border: "none",
  background: active ? "#1e293b" : "transparent",
  color: "#fff",
  cursor: "pointer",
});

const styles = {
  app: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    height: "100vh",
  },
  sidebar: {
    background: "#020617",
    color: "#fff",
    padding: 16,
    display: "flex",
    flexDirection: "column",
  },
  shiftBox: {
    marginTop: 16,
    padding: 10,
    border: "1px solid #1e293b",
    borderRadius: 8,
    fontSize: 13,
  },
  logout: {
    marginTop: "auto",
    padding: 10,
    background: "#334155",
    border: "none",
    color: "#fff",
    borderRadius: 6,
  },
  main: {
    padding: 24,
    background: "#f5f7fa",
    overflow: "auto",
  },
  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    border: "1px solid #e5e7eb",
  },
  time: {
    fontSize: 12,
    color: "#6b7280",
  },
};

export default HistoryTransaksi;
