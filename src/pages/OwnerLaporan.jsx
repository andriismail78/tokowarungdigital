import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const rp = (n = 0) => new Intl.NumberFormat("id-ID").format(n);

const OwnerLaporan = () => {
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [todayTotal, setTodayTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [trxCount, setTrxCount] = useState(0);
  const [daily, setDaily] = useState([]);

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      const oid = data.user.id;
      setOwnerId(oid);

      await loadLaporan(oid);
      setLoading(false);
    };

    init();
  }, []);

  /* ================= LOAD ================= */
  const loadLaporan = async (oid) => {
    const today = new Date();
    const startToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString();

    const startMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toISOString();

    // transaksi hari ini
    const { data: trxToday } = await supabase
      .from("transaksi")
      .select("total")
      .eq("owner_id", oid)
      .gte("created_at", startToday);

    const todaySum = (trxToday || []).reduce(
      (s, t) => s + Number(t.total),
      0
    );

    // transaksi bulan ini
    const { data: trxMonth } = await supabase
      .from("transaksi")
      .select("total")
      .eq("owner_id", oid)
      .gte("created_at", startMonth);

    const monthSum = (trxMonth || []).reduce(
      (s, t) => s + Number(t.total),
      0
    );

    // semua transaksi (count)
    const { count } = await supabase
      .from("transaksi")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", oid);

    // rekap per hari (30 hari terakhir)
    const { data: trxDaily } = await supabase
      .from("transaksi")
      .select("created_at,total")
      .eq("owner_id", oid)
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      )
      .order("created_at");

    const map = {};
    (trxDaily || []).forEach((t) => {
      const d = new Date(t.created_at).toLocaleDateString("id-ID");
      map[d] = (map[d] || 0) + Number(t.total);
    });

    setTodayTotal(todaySum);
    setMonthTotal(monthSum);
    setTrxCount(count || 0);
    setDaily(
      Object.entries(map).map(([date, total]) => ({ date, total }))
    );
  };

  if (loading) return <div>Loading laporan...</div>;

  return (
    <div style={styles.wrapper}>
      <h1>Laporan Penjualan</h1>
      <p>Ringkasan performa usaha Anda</p>

      {/* SUMMARY */}
      <div style={styles.stats}>
        <div style={styles.card}>
          <h3>Hari Ini</h3>
          <span>Rp {rp(todayTotal)}</span>
        </div>

        <div style={styles.card}>
          <h3>Bulan Ini</h3>
          <span>Rp {rp(monthTotal)}</span>
        </div>

        <div style={styles.card}>
          <h3>Total Transaksi</h3>
          <span>{trxCount}</span>
        </div>
      </div>

      {/* DAILY */}
      <div style={styles.box}>
        <h2>Penjualan Harian (30 Hari)</h2>

        {daily.length === 0 && <p>Belum ada transaksi</p>}

        {daily.map((d, i) => (
          <div key={i} style={styles.row}>
            <span>{d.date}</span>
            <strong>Rp {rp(d.total)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerLaporan;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    padding: 24,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  box: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
};
