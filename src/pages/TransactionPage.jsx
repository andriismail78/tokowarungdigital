import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const TransactionPage = () => {
  const [barcode, setBarcode] = useState("");
  const [produk, setProduk] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ============================
     SCAN / INPUT BARCODE
  ============================ */
  const handleScan = async () => {
    setLoading(true);
    setProduk(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    /* 1️⃣ CEK PRODUK OWNER */
    let { data: ownerProduct } = await supabase
      .from("products_owner")
      .select("*")
      .eq("owner_id", user.id)
      .eq("barcode", barcode)
      .single();

    if (ownerProduct) {
      setProduk(ownerProduct);
      setLoading(false);
      return;
    }

    /* 2️⃣ CEK MASTER */
    const { data: masterProduct } = await supabase
      .from("products_master")
      .select("*")
      .eq("barcode", barcode)
      .single();

    if (masterProduct) {
      /* 3️⃣ AUTO CREATE KE OWNER */
      const { data: newOwnerProduct, error } = await supabase
        .from("products_owner")
        .insert([
          {
            owner_id: user.id,
            master_id: masterProduct.id,
            nama: masterProduct.nama,
            merk: masterProduct.merk,
            kategori: masterProduct.kategori,
            barcode: masterProduct.barcode,
            harga: masterProduct.harga || 0,
            stock: 0,
            status: "aktif",
          },
        ])
        .select()
        .single();

      if (!error) setProduk(newOwnerProduct);
      setLoading(false);
      return;
    }

    /* 4️⃣ TIDAK ADA DI MANA-MANA */
    alert("Produk tidak ditemukan. Silakan input manual di menu Produk.");
    setLoading(false);
  };

  /* ============================
     SIMPAN TRANSAKSI
  ============================ */
  const handleSubmit = async () => {
    if (!produk) return;

    const total = produk.harga * qty;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("transaksi").insert([
      {
        owner_id: user.id,
        produk_id: produk.id,
        qty,
        total,
      },
    ]);

    alert("Transaksi berhasil");
    setBarcode("");
    setProduk(null);
    setQty(1);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Transaksi</h1>

      <div>
        <label>Scan / Input Barcode</label>
        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="Scan barcode di sini"
        />
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Mencari..." : "Scan"}
        </button>
      </div>

      {produk && (
        <div style={{ marginTop: 16, border: "1px solid #ddd", padding: 16 }}>
          <h3>{produk.nama}</h3>
          <p>Harga: Rp {produk.harga}</p>
          <p>Stok: {produk.stock}</p>

          <label>Qty</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />

          <p>Total: Rp {produk.harga * qty}</p>

          <button onClick={handleSubmit}>Simpan Transaksi</button>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
