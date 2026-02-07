// frontend/src/pages/DashboardMarketing.jsx
import React from "react";

const DashboardMarketing = () => {
  return (
    <div style={styles.wrapper}>
      <h1>Dashboard Marketing</h1>

      <div style={styles.card}>
        <h3>Ringkasan</h3>
        <p>Belum ada data pemasaran yang ditampilkan.</p>
      </div>

      <div style={styles.card}>
        <h3>Menu Marketing</h3>
        <ul>
          <li>📊 Statistik Leads</li>
          <li>👥 Sub Marketing</li>
          <li>💸 Komisi & Insentif</li>
        </ul>
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
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
};

export default DashboardMarketing;
