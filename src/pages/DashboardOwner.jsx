import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import styles from "./DashboardOwner.module.css";

const rp = (n = 0) => new Intl.NumberFormat("id-ID").format(n);

/* ================= PLAN CONFIG ================= */

const PLAN_ORDER = ["basic", "starter", "bisnis", "enterprise"];

const PLAN_LABEL = {
  basic: "BASIC",
  starter: "STARTER",
  bisnis: "BISNIS",
  enterprise: "ENTERPRISE",
};

const PLAN_LIMIT = {
  basic: { kasir: 0, produk: 500 },
  starter: { kasir: 0, produk: 500 },
  bisnis: { kasir: 4, produk: Infinity },
  enterprise: { kasir: Infinity, produk: Infinity },
};

const hasAccess = (current, required) =>
  PLAN_ORDER.indexOf(current) >= PLAN_ORDER.indexOf(required);

/* ================= COMPONENT ================= */

const DashboardOwner = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("starter");
  const [namaUsaha, setNamaUsaha] = useState("Usaha Anda");

  const [stats, setStats] = useState({
    omzetHariIni: 0,
    transaksiHariIni: 0,
    produk: 0,
    kasir: 0,
  });

  const [recent, setRecent] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const ownerId = auth.user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan, nama_usaha")
        .eq("id", ownerId)
        .maybeSingle();

      setPlan(profile?.plan || "starter");
      setNamaUsaha(profile?.nama_usaha || "Usaha Anda");

      await loadStats(ownerId);
      await loadRecent(ownerId);
      await loadLowStock(ownerId);

      setLoading(false);
    };

    init();
  }, []);

  /* ================= LOAD DATA ================= */

  const loadStats = async (ownerId) => {
    const today = new Date().toISOString().slice(0, 10);

    const { data: trx } = await supabase
      .from("transaksi")
      .select("total")
      .eq("owner_id", ownerId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`);

    const omzetHariIni = (trx || []).reduce(
      (s, t) => s + Number(t.total),
      0
    );

    const { count: produk } = await supabase
      .from("products_owner")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", ownerId);

    const { count: kasir } = await supabase
      .from("kasir")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", ownerId);

    setStats({
      omzetHariIni,
      transaksiHariIni: trx?.length || 0,
      produk: produk || 0,
      kasir: kasir || 0,
    });
  };

  const loadRecent = async (ownerId) => {
    const { data } = await supabase
      .from("transaksi")
      .select("id,total,created_at")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false })
      .limit(5);

    setRecent(data || []);
  };

  const loadLowStock = async (ownerId) => {
    const { data } = await supabase
      .from("products_owner")
      .select("id,stock,stock_minimum")
      .eq("owner_id", ownerId);

    const low =
      (data || []).filter(
        (p) =>
          p.stock_minimum !== null &&
          p.stock <= p.stock_minimum
      ).length || 0;

    setLowStockCount(low);
  };

  if (loading) {
    return <div className={styles.wrapper}>Loading dashboard…</div>;
  }

  const limit = PLAN_LIMIT[plan];

  return (
    <div className={styles.wrapper}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <h1>{namaUsaha}</h1>
        <p>Ringkasan usaha & kontrol fitur</p>

        <div style={badgeStyle}>
          Plan: <strong>{PLAN_LABEL[plan]}</strong>
        </div>

        {/* CTA KASIR + SHORTCUT */}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => navigate("/dashboard/kasir")}
            style={ctaKasir}
          >
            🟢 Mulai Transaksi (Mode Kasir)
          </button>

          {(plan === "basic" || plan === "starter") && (
            <div style={ctaNote}>
              Sebagai owner, Anda dapat langsung melayani transaksi.
            </div>
          )}

          <button
            onClick={() => navigate("/owner/pengaturan")}
            style={shortcutLink}
          >
            ⚙️ Kelola Kasir →
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className={styles.stats}>
        <StatCard label="Omzet Hari Ini" value={`Rp ${rp(stats.omzetHariIni)}`} />
        <StatCard label="Transaksi Hari Ini" value={stats.transaksiHariIni} />
        <StatCard
          label="Produk"
          value={`${stats.produk} / ${
            limit.produk === Infinity ? "∞" : limit.produk
          }`}
        />
        <StatCard
          label="Kasir"
          value={`${stats.kasir} / ${
            limit.kasir === Infinity ? "∞" : limit.kasir
          }`}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className={styles.content}>
        <div className={styles.box}>
          <h2>Transaksi Terakhir</h2>

          {recent.length === 0 && <p>Belum ada transaksi</p>}

          {recent.map((t) => (
            <div key={t.id} style={rowStyle}>
              <strong>Rp {rp(t.total)}</strong>
              <div style={timeStyle}>
                {new Date(t.created_at).toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.box}>
          <h2>Status & Fitur</h2>

          <div style={stockBox(lowStockCount)}>
            {lowStockCount > 0 ? (
              <>
                ⚠️ <strong>{lowStockCount}</strong> produk stok hampir habis
              </>
            ) : (
              <>✅ Semua stok aman</>
            )}
          </div>

          <Feature label="Tambah Kasir" enabled={hasAccess(plan, "bisnis")} />
          <Feature label="Analitik Lengkap" enabled={hasAccess(plan, "bisnis")} />
          <Feature label="Multi Usaha" enabled={hasAccess(plan, "enterprise")} />
          <Feature label="API Access" enabled={hasAccess(plan, "enterprise")} />
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENT ================= */

const StatCard = ({ label, value }) => (
  <div className={styles.card}>
    <h3>{label}</h3>
    <span>{value}</span>
  </div>
);

const Feature = ({ label, enabled }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      opacity: enabled ? 1 : 0.5,
    }}
  >
    <span>{label}</span>
    <span style={{ fontSize: 12 }}>
      {enabled ? "Aktif" : "🔒 Upgrade"}
    </span>
  </div>
);

/* ================= INLINE STYLES ================= */

const badgeStyle = {
  marginTop: 12,
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  fontSize: 13,
};

const ctaKasir = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const ctaNote = {
  marginTop: 6,
  fontSize: 12,
  color: "#6b7280",
};

const shortcutLink = {
  marginTop: 8,
  background: "transparent",
  border: "none",
  color: "#2563eb",
  fontSize: 13,
  cursor: "pointer",
  padding: 0,
};

const rowStyle = {
  padding: "12px 0",
  borderBottom: "1px solid #eee",
};

const timeStyle = {
  fontSize: 12,
  color: "#6b7280",
};

const stockBox = (count) => ({
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
  background: count > 0 ? "#fef3c7" : "#ecfeff",
});

export default DashboardOwner;
