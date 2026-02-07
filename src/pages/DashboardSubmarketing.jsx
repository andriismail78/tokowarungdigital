// frontend/src/pages/DashboardSubmarketing.jsx
import React from "react";

const DashboardSubmarketing = () => {
  return (
    <div style={styles.wrapper}>
      <h1>Dashboard Sub Marketing</h1>

      <div style={styles.card}>
        <h3>Status Akun</h3>
        <p>Akun sub marketing aktif.</p>
      </div>

      <div style={styles.card}>
        <h3>Aktivitas</h3>
        <ul>
          <li>🔗 Link Referral</li>
          <li>🧾 Riwayat Pendaftaran</li>
          <li>💰 Estimasi Komisi</li>
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

export default DashboardSubmarketing;
