import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const OwnerBusinessSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        setLoading(false);
        return;
      }

      // ✅ FIX: ganti kolom
      const { data, error } = await supabase
        .from("profiles")
        .select("nama_usaha, alamat")
        .eq("id", auth.user.id)
        .single();

      if (error) {
        setError("Gagal memuat data usaha");
      } else {
        setBusinessName(data?.nama_usaha || "");
        setAddress(data?.alamat || "");
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      setSaving(false);
      return;
    }

    // ✅ FIX: update ke kolom yang benar
    const { error } = await supabase
      .from("profiles")
      .update({
        nama_usaha: businessName,
        alamat: address,
      })
      .eq("id", auth.user.id);

    if (error) {
      setError("Gagal menyimpan pengaturan");
    } else {
      setSuccess("Pengaturan usaha berhasil disimpan");
    }

    setSaving(false);
  };

  /* ================= UI ================= */
  if (loading) {
    return <p style={{ padding: 24 }}>Memuat pengaturan usaha...</p>;
  }

  return (
    <div style={styles.wrapper}>
      <h2>Pengaturan Usaha</h2>
      <p style={styles.subtitle}>
        Informasi ini akan tampil di struk dan laporan
      </p>

      <form onSubmit={handleSave} style={styles.card}>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.field}>
          <label>Nama Usaha</label>
          <input
            type="text"
            placeholder="Contoh: Toko Sumber Rejeki"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Alamat Usaha</label>
          <textarea
            placeholder="Jl. Contoh No. 12, Jakarta"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.textarea}
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            ...styles.button,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
};

export default OwnerBusinessSettings;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    padding: 24,
    maxWidth: 520,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  field: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },
  textarea: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    resize: "vertical",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
};
