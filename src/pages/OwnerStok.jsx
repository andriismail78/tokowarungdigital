import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const OwnerStok = () => {
  const [ownerId, setOwnerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      setOwnerId(data.user.id);
      await loadProducts(data.user.id);
      setLoading(false);
    };

    init();
  }, []);

  /* ================= LOAD ================= */
  const loadProducts = async (oid) => {
    const { data, error } = await supabase
      .from("products_owner")
      .select("id,nama,stock,stock_minimum")
      .eq("owner_id", oid)
      .order("nama");

    if (error) {
      alert(error.message);
      return;
    }

    setProducts(data || []);
  };

  /* ================= UPDATE ================= */
  const updateField = async (id, field, value) => {
    setSavingId(id);

    const { error } = await supabase
      .from("products_owner")
      .update({ [field]: Number(value) })
      .eq("id", id);

    if (error) {
      alert(error.message);
    }

    setSavingId(null);
  };

  if (loading) return <div>Loading stok...</div>;

  return (
    <div style={styles.wrapper}>
      <h1>Stok Produk</h1>
      <p>Kelola jumlah stok dan batas minimum (Owner Only)</p>

      <div style={styles.table}>
        <div style={{ ...styles.row, ...styles.header }}>
          <div>Produk</div>
          <div>Stok</div>
          <div>Minimum</div>
          <div>Status</div>
        </div>

        {products.map((p) => {
          const menipis = p.stock <= p.stock_minimum;

          return (
            <div key={p.id} style={styles.row}>
              <div>{p.nama}</div>

              <input
                type="number"
                min="0"
                defaultValue={p.stock}
                style={styles.input}
                onBlur={(e) =>
                  updateField(p.id, "stock", e.target.value)
                }
              />

              <input
                type="number"
                min="0"
                defaultValue={p.stock_minimum || 0}
                style={styles.input}
                onBlur={(e) =>
                  updateField(p.id, "stock_minimum", e.target.value)
                }
              />

              <div>
                {menipis ? (
                  <span style={styles.badgeDanger}>MENIPIS</span>
                ) : (
                  <span style={styles.badgeSafe}>AMAN</span>
                )}
                {savingId === p.id && (
                  <span style={styles.saving}> menyimpan...</span>
                )}
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <p style={{ marginTop: 16 }}>Belum ada produk</p>
        )}
      </div>
    </div>
  );
};

export default OwnerStok;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    padding: 24,
  },
  table: {
    marginTop: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "1px solid #eee",
    gap: 8,
  },
  header: {
    background: "#f8fafc",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: 6,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },
  badgeDanger: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },
  badgeSafe: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },
  saving: {
    marginLeft: 6,
    fontSize: 12,
    color: "#64748b",
  },
};
