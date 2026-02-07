import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/* ================= PLAN CONFIG ================= */

const PLAN_ORDER = ["basic", "starter", "bisnis", "enterprise"];

const PLAN_LABEL = {
  basic: "Basic",
  starter: "Starter",
  bisnis: "Bisnis",
  enterprise: "Enterprise",
};

const PLAN_PRICE = {
  basic: "Rp25.000 / bulan",
  starter: "Rp50.000 / bulan",
  bisnis: "Rp250.000 / bulan",
  enterprise: "Rp500.000 / bulan",
};

const PLAN_FEATURES = {
  basic: ["Owner merangkap kasir", "Hingga 500 produk", "Laporan penjualan"],
  starter: ["Owner merangkap kasir", "Hingga 500 produk", "Laporan penjualan"],
  bisnis: ["Hingga 4 kasir", "Produk tidak terbatas", "Analitik lengkap"],
  enterprise: ["Kasir tidak terbatas", "Multi usaha", "API access"],
};

const PLAN_LIMIT = {
  basic: { kasir: 0 },
  starter: { kasir: 1 }, // ✅ BENAR
  bisnis: { kasir: 4 },
  enterprise: { kasir: Infinity },
};


/* ================= COMPONENT ================= */

const OwnerPengaturan = () => {
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const [plan, setPlan] = useState("starter");
  const [kasirList, setKasirList] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;

    const oid = auth.user.id;
    setOwnerId(oid);

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", oid)
      .maybeSingle();

    setPlan(profile?.plan || "starter");
    await loadKasir(oid);

    setLoading(false);
  };

  const loadKasir = async (oid) => {
    const { data } = await supabase
      .from("kasir")
      .select("id,email,status,created_at")
      .eq("owner_id", oid)
      .order("created_at", { ascending: false });

    setKasirList(data || []);
  };

  const aktifkanKasir = async (kasirId) => {
    await supabase
      .from("kasir")
      .update({ status: "ACTIVE" })
      .eq("id", kasirId);

    await loadKasir(ownerId);
  };

  const nonaktifkanKasir = async (kasirId) => {
    const ok = window.confirm(
      "Kasir ini akan dinonaktifkan dan tidak bisa login. Lanjutkan?"
    );
    if (!ok) return;

    await supabase
      .from("kasir")
      .update({ status: "INACTIVE" })
      .eq("id", kasirId);

    await loadKasir(ownerId);
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Loading pengaturan…</div>;
  }

  const limitKasir = PLAN_LIMIT[plan].kasir;

  return (
    <div style={wrapper}>
      <h1>Pengaturan</h1>
      <p>Kelola kasir dan paket langganan usaha Anda</p>

      {/* ================= KASIR ================= */}
      <section style={box}>
        <h2>Kelola Kasir</h2>

        {kasirList.length === 0 && <p>Belum ada kasir.</p>}

        {kasirList.map((k) => {
          const isActive = k.status?.toUpperCase() === "ACTIVE";

          // hitung kasir aktif SELAIN kasir ini
          const activeKasirExceptThis = kasirList.filter(
            (x) =>
              x.status?.toUpperCase() === "ACTIVE" && x.id !== k.id
          ).length;

          const canActivate =
            limitKasir === Infinity ||
            activeKasirExceptThis + 1 <= limitKasir;

          return (
            <div key={k.id} style={row}>
              <div>
                <strong>{k.email}</strong>
                <div style={smallText}>
                  Status:{" "}
                  <span style={{ color: isActive ? "green" : "red" }}>
                    {k.status}
                  </span>
                </div>
              </div>

              {isActive ? (
                <button
                  onClick={() => nonaktifkanKasir(k.id)}
                  style={btnDanger}
                >
                  Nonaktifkan
                </button>
              ) : (
                <button
                  onClick={() => aktifkanKasir(k.id)}
                  disabled={!canActivate}
                  style={{
                    ...btnPrimary,
                    opacity: canActivate ? 1 : 0.5,
                    cursor: canActivate ? "pointer" : "not-allowed",
                  }}
                >
                  Aktifkan
                </button>
              )}
            </div>
          );
        })}
      </section>

      {/* ================= PAKET LANGGANAN ================= */}
      <section style={box}>
        <h2>Paket Langganan</h2>

        <div style={planGrid}>
          {PLAN_ORDER.map((p) => {
            const isActive = p === plan;
            if (!isActive && PLAN_ORDER.indexOf(p) < PLAN_ORDER.indexOf(plan)) {
              return null;
            }

            return (
              <div
                key={p}
                style={{
                  ...planCard,
                  borderColor: isActive ? "#16a34a" : "#e5e7eb",
                }}
              >
                <h3>{PLAN_LABEL[p]}</h3>
                <div style={price}>{PLAN_PRICE[p]}</div>

                <ul style={featureList}>
                  {PLAN_FEATURES[p].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {isActive ? (
                  <div style={activeBadge}>AKTIF</div>
                ) : (
                  <button style={btnPrimary}>Upgrade</button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

/* ================= STYLES ================= */

const wrapper = { padding: 24, maxWidth: 1000 };
const box = {
  marginTop: 24,
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};
const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #f1f5f9",
};
const smallText = { fontSize: 12, color: "#6b7280" };
const btnDanger = {
  padding: "6px 12px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};
const btnPrimary = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};
const planGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};
const planCard = { padding: 20, borderRadius: 12, border: "2px solid #e5e7eb" };
const price = { fontSize: 18, fontWeight: 600, marginBottom: 12 };
const featureList = { fontSize: 14, paddingLeft: 16, marginBottom: 16 };
const activeBadge = {
  padding: "6px 12px",
  background: "#16a34a",
  color: "#fff",
  borderRadius: 6,
  fontSize: 12,
};

export default OwnerPengaturan;
