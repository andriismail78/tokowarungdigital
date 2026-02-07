// frontend/src/pages/OwnerKasirPage.jsx
import React from "react";

const OwnerKasirPage = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1>Manajemen Kasir</h1>
        <button style={styles.addButton}>+ Tambah Kasir</button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nama Kasir</th>
              <th>Email</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" style={styles.empty}>
                Belum ada kasir terdaftar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.note}>
        <p>
          Kasir hanya dapat melakukan transaksi sesuai cabang yang ditugaskan.
          Jumlah kasir dibatasi oleh paket subscription Anda.
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  addButton: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  empty: {
    textAlign: "center",
    padding: "24px",
    color: "#6b7280",
  },
  note: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#374151",
  },
};

export default OwnerKasirPage;
