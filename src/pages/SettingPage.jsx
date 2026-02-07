// frontend/src/pages/SettingPage.jsx
import React from "react";

const SettingPage = () => {
  return (
    <div style={styles.wrapper}>
      <h1>Pengaturan</h1>

      <div style={styles.section}>
        <h3>Informasi Toko</h3>
        <div style={styles.field}>
          <label>Nama Toko</label>
          <input type="text" placeholder="Nama Toko Anda" />
        </div>
        <div style={styles.field}>
          <label>Email Toko</label>
          <input type="email" placeholder="email@toko.com" />
        </div>
      </div>

      <div style={styles.section}>
        <h3>Keamanan</h3>
        <div style={styles.field}>
          <label>Password Baru</label>
          <input type="password" placeholder="********" />
        </div>
        <button style={styles.button}>Simpan Perubahan</button>
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
  section: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default SettingPage;
