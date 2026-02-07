import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const rp = (n = 0) => new Intl.NumberFormat("id-ID").format(n);

const OwnerTransaksi = () => {
  const [ownerId, setOwnerId] = useState(null);
  const [transaksi, setTransaksi] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [returQty, setReturQty] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      setOwnerId(data.user.id);
      await loadTransaksi(data.user.id);
      setLoading(false);
    };
    init();
  }, []);

  /* ================= LOAD ================= */

  const loadTransaksi = async (oid) => {
    const { data } = await supabase
      .from("transaksi")
      .select("id,total,created_at")
      .eq("owner_id", oid)
      .order("created_at", { ascending: false });

    setTransaksi(data || []);
  };

  const loadItems = async (trxId) => {
    const { data } = await supabase
      .from("transaksi_items")
      .select("id,produk_id,qty,harga,subtotal")
      .eq("transaksi_id", trxId);

    setItems(data || []);
    setReturQty({});
  };

  /* ================= RETUR PER ITEM ================= */

  const handleReturItem = async (item) => {
    const qty = Number(returQty[item.id] || 0);
    if (qty <= 0) return alert("Qty retur tidak valid");
    if (qty > item.qty) return alert("Qty melebihi jumlah beli");

    if (!window.confirm(`Retur ${qty} item ini?`)) return;

    try {
      // rollback stok
      await supabase.rpc("increment_stock", {
        p_produk_id: item.produk_id,
        p_qty: qty,
      });

      // catat retur
      await supabase.from("retur_transaksi").insert({
        transaksi_id: selected.id,
        owner_id: ownerId,
        produk_id: item.produk_id,
        qty,
        reason: "Retur per item oleh owner",
      });

      // update qty item transaksi
      const sisa = item.qty - qty;

      if (sisa > 0) {
        await supabase
          .from("transaksi_items")
          .update({
            qty: sisa,
            subtotal: sisa * item.harga,
          })
          .eq("id", item.id);
      } else {
        await supabase.from("transaksi_items").delete().eq("id", item.id);
      }

      alert("Retur berhasil, stok dikembalikan.");
      await loadItems(selected.id);
      await loadTransaksi(ownerId);
    } catch (e) {
      alert("Gagal melakukan retur");
    }
  };

  /* ================= DELETE TRANSAKSI ================= */

  const handleDeleteTransaksi = async () => {
    if (!selected) return;
    if (
      !window.confirm(
        "Hapus transaksi ini? Semua item akan dikembalikan ke stok."
      )
    )
      return;

    try {
      const { data: trxItems } = await supabase
        .from("transaksi_items")
        .select("produk_id,qty")
        .eq("transaksi_id", selected.id);

      for (const it of trxItems || []) {
        await supabase.rpc("increment_stock", {
          p_produk_id: it.produk_id,
          p_qty: it.qty,
        });
      }

      await supabase.from("transaksi").delete().eq("id", selected.id);

      alert("Transaksi dihapus dan stok dikembalikan.");
      setSelected(null);
      setItems([]);
      await loadTransaksi(ownerId);
    } catch (e) {
      alert("Gagal menghapus transaksi");
    }
  };

  if (loading) return <div>Loading transaksi...</div>;

  return (
    <div style={styles.wrapper}>
      <h1>Transaksi</h1>
      <p>Owner dapat melakukan retur per item dan hapus transaksi</p>

      <div style={styles.grid}>
        {/* LIST TRANSAKSI */}
        <div style={styles.list}>
          {transaksi.map((t) => (
            <div
              key={t.id}
              style={{
                ...styles.row,
                background:
                  selected?.id === t.id ? "#e0f2fe" : "transparent",
              }}
              onClick={async () => {
                setSelected(t);
                await loadItems(t.id);
              }}
            >
              <strong>Rp {rp(t.total)}</strong>
              <div style={styles.time}>
                {new Date(t.created_at).toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>

        {/* DETAIL */}
        <div style={styles.detail}>
          {!selected && <p>Pilih transaksi</p>}

          {selected && (
            <>
              <h3>Detail Item</h3>

              {items.map((i) => (
                <div key={i.id} style={styles.item}>
                  <div>
                    Produk #{i.produk_id} <br />
                    Qty: {i.qty}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div>Rp {rp(i.subtotal)}</div>

                    <input
                      type="number"
                      min="1"
                      max={i.qty}
                      placeholder="Qty retur"
                      value={returQty[i.id] || ""}
                      onChange={(e) =>
                        setReturQty({
                          ...returQty,
                          [i.id]: e.target.value,
                        })
                      }
                      style={styles.input}
                    />

                    <button
                      onClick={() => handleReturItem(i)}
                      style={styles.btnRetur}
                    >
                      Retur Item
                    </button>
                  </div>
                </div>
              ))}

              <hr />

              <button
                onClick={handleDeleteTransaksi}
                style={styles.btnDelete}
              >
                🗑 Hapus Seluruh Transaksi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerTransaksi;

/* ================= STYLES ================= */

const styles = {
  wrapper: { padding: 24 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  list: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    maxHeight: "70vh",
    overflow: "auto",
  },
  row: {
    padding: 12,
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  time: { fontSize: 12, color: "#6b7280" },
  detail: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 16,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    marginTop: 4,
    marginBottom: 4,
    padding: 6,
  },
  btnRetur: {
    width: "100%",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: 6,
    cursor: "pointer",
  },
  btnDelete: {
    width: "100%",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: 10,
    marginTop: 12,
    cursor: "pointer",
  },
};
