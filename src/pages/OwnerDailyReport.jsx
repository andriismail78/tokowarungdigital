import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const OwnerDailyReport = () => {
  const [loading, setLoading] = useState(true);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const rp = (n) => new Intl.NumberFormat("id-ID").format(n);

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        setLoading(false);
        return;
      }

      const ownerId = auth.user.id;

      // ✅ FIX: kolom disesuaikan
      const { data: profile } = await supabase
        .from("profiles")
        .select("nama_usaha, alamat, email")
        .eq("id", ownerId)
        .single();

      setOwnerProfile(profile);

      const today = new Date().toISOString().slice(0, 10);

      const { data: trx } = await supabase
        .from("transaksi")
        .select("id,total,created_at")
        .eq("owner_id", ownerId)
        .gte("created_at", `${today} 00:00:00`)
        .order("created_at", { ascending: false });

      setTransactions(trx || []);
      setLoading(false);
    };

    init();
  }, []);

  /* ================= AGREGASI ================= */
  const totalOmzet = transactions.reduce(
    (sum, t) => sum + (t.total || 0),
    0
  );

  if (loading) {
    return <p style={{ padding: 24 }}>Memuat laporan harian...</p>;
  }

  return (
    <div style={styles.wrapper}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>
          {ownerProfile?.nama_usaha ||
            ownerProfile?.email ||
            "Usaha UMKM"}
        </h2>
        {ownerProfile?.alamat && (
          <p style={styles.address}>{ownerProfile.alamat}</p>
        )}
        <p style={styles.date}>
          Laporan Harian —{" "}
          {new Date().toLocaleDateString("id-ID")}
        </p>
      </div>

      {/* SUMMARY */}
      <div style={styles.summary}>
        <div style={styles.card}>
          <p>Total Transaksi</p>
          <h3>{transactions.length}</h3>
        </div>
        <div style={styles.card}>
          <p>Total Omzet</p>
          <h3>Rp {rp(totalOmzet)}</h3>
        </div>
      </div>

      {/* LIST */}
      <div style={styles.list}>
        <h3>Detail Transaksi</h3>

        {transactions.length === 0 && (
          <p>Tidak ada transaksi hari ini</p>
        )}

        {transactions.map((t, i) => (
          <div key={t.id} style={styles.row}>
            <span>#{i + 1}</span>
            <span>
              {new Date(t.created_at).toLocaleTimeString(
                "id-ID"
              )}
            </span>
            <strong>Rp {rp(t.total)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDailyReport;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    padding: 24,
    maxWidth: 900,
  },
  header: {
    marginBottom: 24,
  },
  address: {
    color: "#64748b",
    fontSize: 14,
  },
  date: {
    marginTop: 4,
    fontSize: 14,
    color: "#475569",
  },
  summary: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    background: "#ffffff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  list: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e2e8f0",
    fontSize: 14,
  },
};
