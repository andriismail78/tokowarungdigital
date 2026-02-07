import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import ReceiptPreview from "../components/ReceiptPreview";

const rp = (n) => new Intl.NumberFormat("id-ID").format(n);

const BASE_PATH = "/dashboard/kasir";

const DashboardKasir = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [shift, setShift] = useState(null);
  const [totalShift, setTotalShift] = useState(0);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [barcode, setBarcode] = useState("");
  const [search, setSearch] = useState("");
  const [cash, setCash] = useState("");

  const [showReceipt, setShowReceipt] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      const uid = data.user.id;
      setUserId(uid);

      const { data: kasir } = await supabase
        .from("kasir")
        .select("owner_id")
        .eq("id", uid)
        .maybeSingle();

      const oid = kasir ? kasir.owner_id : uid;
      setOwnerId(oid);

      await loadShift(uid);
    };

    init();
  }, []);

  const loadShift = async (kasirId) => {
    const { data } = await supabase
      .from("shift_kasir")
      .select("*")
      .eq("kasir_id", kasirId)
      .eq("status", "OPEN")
      .maybeSingle();

    setShift(data || null);

    if (data) {
      const { data: trx } = await supabase
        .from("transaksi")
        .select("total")
        .eq("shift_id", data.id);

      setTotalShift((trx || []).reduce((s, t) => s + Number(t.total), 0));
    } else {
      setTotalShift(0);
    }
  };

  /* ================= PRODUK ================= */
  useEffect(() => {
    if (!ownerId) return;

    supabase
      .from("products_owner")
      .select("id,nama,harga,barcode,stock")
      .eq("owner_id", ownerId)
      .gt("stock", 0)
      .then(({ data }) => setProducts(data || []));
  }, [ownerId]);

  /* ================= CART ================= */
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  /* ================= PAY ================= */
  const subtotal = cart.reduce((s, i) => s + i.qty * i.harga, 0);
  const change = cash ? Number(cash) - subtotal : 0;

  const handlePay = async () => {
    if (!shift) return alert("Kasir belum OPEN");
    if (cart.length === 0) return alert("Keranjang kosong");
    if (!cash || Number(cash) < subtotal)
      return alert("Uang diterima kurang");

    const { data: trx, error } = await supabase
      .from("transaksi")
      .insert({
        owner_id: ownerId,
        kasir_id: userId,
        shift_id: shift.id,
        total: subtotal,
      })
      .select()
      .single();

    if (error) return alert(error.message);

    await supabase.from("transaksi_items").insert(
      cart.map((c) => ({
        transaksi_id: trx.id,
        produk_id: c.id,
        qty: c.qty,
        harga: c.harga,
        subtotal: c.qty * c.harga,
      }))
    );

    setShowReceipt(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {showReceipt && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <ReceiptPreview
              ownerId={ownerId}
              cart={cart}
              subtotal={subtotal}
              cash={Number(cash)}
            />
            <button
              onClick={() => {
                setShowReceipt(false);
                setCart([]);
                setCash("");
              }}
              style={styles.btnSecondary}
            >
              Tutup
            </button>
            <button onClick={() => window.print()} style={styles.btnPrimary}>
              Cetak
            </button>
          </div>
        </div>
      )}

      <div style={styles.app}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.brand}>Kasir</div>

          <nav style={styles.nav}>
            <NavItem
              active={location.pathname === BASE_PATH}
              onClick={() => navigate(BASE_PATH)}
            >
              Transaksi
            </NavItem>
            <NavItem
              active={location.pathname === `${BASE_PATH}/history`}
              onClick={() => navigate(`${BASE_PATH}/history`)}
            >
              History
            </NavItem>
          </nav>

          <div style={styles.shiftBox}>
            <div>Status: <strong>{shift ? "OPEN" : "CLOSED"}</strong></div>
            <div>Total: Rp {rp(totalShift)}</div>
          </div>

          {!shift ? (
            <button
              onClick={async () => {
                await supabase.from("shift_kasir").insert({
                  kasir_id: userId,
                  owner_id: ownerId,
                  status: "OPEN",
                });
                await loadShift(userId);
              }}
              style={styles.btnOpen}
            >
              Open Kasir
            </button>
          ) : (
            <button
              onClick={async () => {
                await supabase
                  .from("shift_kasir")
                  .update({
                    status: "CLOSED",
                    closed_at: new Date().toISOString(),
                  })
                  .eq("id", shift.id);
                setShift(null);
                setTotalShift(0);
              }}
              style={styles.btnClose}
            >
              Close Kasir
            </button>
          )}

          <button onClick={logout} style={styles.logout}>
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <section style={styles.main}>
          <input
            placeholder="Scan / ketik barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            style={styles.input}
          />

          <div style={styles.products}>
            {products
              .filter((p) =>
                p.nama.toLowerCase().includes(search.toLowerCase())
              )
              .map((p) => (
                <div
                  key={p.id}
                  style={styles.product}
                  onClick={() => addToCart(p)}
                >
                  <strong>{p.nama}</strong>
                  <span>Rp {rp(p.harga)}</span>
                </div>
              ))}
          </div>
        </section>

        {/* CART */}
        <section style={styles.cart}>
          <h3>Keranjang</h3>

          {cart.map((c) => (
            <div key={c.id} style={styles.cartItem}>
              <div>
                {c.nama} ({c.qty})
              </div>
              <button onClick={() => removeItem(c.id)}>✕</button>
            </div>
          ))}

          <hr />

          <div style={styles.total}>
            <span>Total</span>
            <strong>Rp {rp(subtotal)}</strong>
          </div>

          <input
            placeholder="Uang diterima"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            style={styles.input}
          />

          <div>
            Kembalian:{" "}
            <strong style={{ color: change < 0 ? "red" : "green" }}>
              Rp {rp(change)}
            </strong>
          </div>

          <button onClick={handlePay} style={styles.btnPrimary}>
            Bayar
          </button>
        </section>
      </div>
    </>
  );
};

const NavItem = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.navItem,
      background: active ? "#1e293b" : "transparent",
    }}
  >
    {children}
  </button>
);

const styles = {
  app: { display: "grid", gridTemplateColumns: "220px 1fr 360px", height: "100vh" },
  sidebar: {
    background: "#020617",
    color: "#fff",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  brand: { fontSize: 18, fontWeight: 600 },
  nav: { display: "flex", flexDirection: "column", gap: 4 },
  navItem: {
    padding: 10,
    textAlign: "left",
    border: "none",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
  },
  shiftBox: {
    marginTop: 12,
    padding: 10,
    border: "1px solid #1e293b",
    borderRadius: 8,
    fontSize: 13,
  },
  btnOpen: { background: "#16a34a", padding: 10, border: "none", color: "#fff" },
  btnClose: { background: "#ef4444", padding: 10, border: "none", color: "#fff" },
  logout: {
    marginTop: "auto",
    background: "#334155",
    padding: 10,
    border: "none",
    color: "#fff",
  },
  main: { padding: 16 },
  products: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))",
    gap: 12,
  },
  product: {
    background: "#fff",
    padding: 12,
    borderRadius: 8,
    cursor: "pointer",
  },
  cart: {
    padding: 16,
    background: "#fff",
    borderLeft: "1px solid #e5e7eb",
  },
  cartItem: { display: "flex", justifyContent: "space-between" },
  total: { display: "flex", justifyContent: "space-between", fontSize: 18 },
  input: { width: "100%", padding: 8, marginBottom: 8 },
  btnPrimary: {
    width: "100%",
    padding: 12,
    background: "#16a34a",
    border: "none",
    color: "#fff",
  },
  btnSecondary: {
  width: "100%",
  padding: 10,
  background: "#e5e7eb",
  border: "none",
  color: "#111827",      // ⬅️ TAMBAHKAN INI
  fontWeight: 600,       // ⬅️ OPSIONAL TAPI DISARANKAN
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: { background: "#fff", padding: 16, width: 320 },
};

export default DashboardKasir;
