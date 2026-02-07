import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ProductForm = ({ onClose }) => {
  const [masterProducts, setMasterProducts] = useState([]);
  const [selectedMasterId, setSelectedMasterId] = useState("");

  const [form, setForm] = useState({
    nama: "",
    merk: "",
    kategori: "",
    barcode: "",
    harga: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  /* =============================
     LOAD MASTER PRODUCTS
  ============================== */
  useEffect(() => {
    const loadMaster = async () => {
      const { data } = await supabase
        .from("products_master")
        .select("id, nama, merk, kategori, barcode")
        .order("nama");

      if (data) setMasterProducts(data);
    };

    loadMaster();
  }, []);

  /* =============================
     SELECT MASTER PRODUCT
  ============================== */
  const handleSelectMaster = (e) => {
    const masterId = e.target.value;
    setSelectedMasterId(masterId);

    if (!masterId) return;

    const selected = masterProducts.find((m) => m.id === masterId);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      nama: selected.nama,
      merk: selected.merk,
      kategori: selected.kategori,
      barcode: selected.barcode || "",
    }));
  };

  /* =============================
     INPUT CHANGE
  ============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =============================
     SUBMIT
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      owner_id: user.id,
      master_id: selectedMasterId || null,
      nama: form.nama,
      merk: form.merk,
      kategori: form.kategori,
      barcode: form.barcode || null,
      harga: Number(form.harga),
      stock: Number(form.stock),
      status: "aktif",
    };

    const { error } = await supabase
      .from("products_owner")
      .insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      alert("Produk berhasil ditambahkan");
      onClose();
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ddd", marginTop: 16 }}>
      <h3>Tambah Produk</h3>

      {/* PILIH MASTER */}
      <div>
        <label>Ambil dari Master (opsional)</label>
        <select value={selectedMasterId} onChange={handleSelectMaster}>
          <option value="">-- Input Manual --</option>
          {masterProducts.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nama} ({m.merk})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama Produk</label>
          <input name="nama" value={form.nama} onChange={handleChange} required />
        </div>

        <div>
          <label>Merk</label>
          <input name="merk" value={form.merk} onChange={handleChange} />
        </div>

        <div>
          <label>Kategori</label>
          <input name="kategori" value={form.kategori} onChange={handleChange} />
        </div>

        <div>
          <label>Barcode (scan / manual)</label>
          <input name="barcode" value={form.barcode} onChange={handleChange} />
        </div>

        <div>
          <label>Harga Jual</label>
          <input type="number" name="harga" value={form.harga} onChange={handleChange} required />
        </div>

        <div>
          <label>Stok</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
