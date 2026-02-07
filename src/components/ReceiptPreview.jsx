import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const rp = (n) => new Intl.NumberFormat("id-ID").format(n);

/**
 * ReceiptPreview
 * SOURCE OF TRUTH:
 * - nama_usaha & alamat DIAMBIL DARI OWNER (ownerId)
 */
const ReceiptPreview = ({ ownerId, cart, subtotal, cash }) => {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [alamatUsaha, setAlamatUsaha] = useState("");

  useEffect(() => {
    if (!ownerId) return;

    const loadOwnerProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("nama_usaha, alamat")
        .eq("id", ownerId)
        .single();

      if (error) {
        console.error("Gagal ambil profil owner:", error);
        return;
      }

      setNamaUsaha(data?.nama_usaha || "");
      setAlamatUsaha(data?.alamat || "");
    };

    loadOwnerProfile();
  }, [ownerId]);

  const change = cash ? cash - subtotal : 0;

  return (
    <div style={styles.paper}>
      {/* HEADER */}
      <div style={styles.center}>
        <h3 style={{ margin: 0 }}>
          {namaUsaha || "Nama Usaha"}
        </h3>
        {alamatUsaha && (
          <p style={styles.small}>{alamatUsaha}</p>
        )}
      </div>

      <hr />

      {/* ITEMS */}
      {cart.map((item) => (
        <div key={item.id} style={styles.row}>
          <div>
            <strong>{item.nama}</strong>
            <div style={styles.small}>
              {item.qty} x Rp {rp(item.harga)}
            </div>
          </div>
          <div>Rp {rp(item.qty * item.harga)}</div>
        </div>
      ))}

      <hr />

      {/* TOTAL */}
      <div style={styles.row}>
        <strong>Total</strong>
        <strong>Rp {rp(subtotal)}</strong>
      </div>

      <div style={styles.row}>
        <span>Bayar</span>
        <span>Rp {rp(cash || 0)}</span>
      </div>

      <div style={styles.row}>
        <span>Kembalian</span>
        <span>Rp {rp(change)}</span>
      </div>

      <hr />

      {/* FOOTER */}
      <div style={styles.center}>
        <p style={styles.small}>Terima kasih 🙏</p>
        <p style={styles.tiny}>
          Support by tokowarungdigital.com
        </p>
      </div>
    </div>
  );
};

export default ReceiptPreview;

/* ================= STYLES ================= */

const styles = {
  paper: {
    width: 280,
    background: "#fff",
    padding: 12,
    fontFamily: "monospace",
    fontSize: 12,
  },
  center: {
    textAlign: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  small: {
    fontSize: 11,
    color: "#555",
  },
  tiny: {
    fontSize: 10,
    color: "#777",
  },
};
