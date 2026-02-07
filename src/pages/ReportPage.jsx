// frontend/src/pages/ReportPage.jsx
import React from "react";

const ReportPage = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1>Laporan</h1>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Total Penjualan</h3>
          <p>Rp 0</p>
        </div>
        <div style={styles.card}>
          <h3>Jumlah Transaksi</h3>
          <p>0</p>
        </div>
        <div style={styles.card}>
          <h3>Produk Terlaris</h3>
          <p>-</p>
        </div>
      </div>

      <div style={styles.note}>
        <p>
          Halaman laporan menampilkan ringkasan performa usaha Anda berdasarkan
          periode tertentu. Data akan tersedia setelah backend laporan aktif dan
          terhubung dengan transaksi.
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "32px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  note: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#374151",
  },
};

export default ReportPage;
