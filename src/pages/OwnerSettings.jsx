const OwnerSettings = () => {
  return (
    <div className="wrapper">
      <div className="header">
        <h1>Pengaturan</h1>
        <p>Kelola pengguna dan hak akses</p>
      </div>

      <div className="box">
        <h2>Tambah Kasir</h2>
        <p>Owner dapat menambahkan akun kasir baru untuk membantu transaksi.</p>

        <form style={{ marginTop: "16px", maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Nama Kasir"
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email Kasir"
            style={inputStyle}
          />
          <button style={buttonStyle} disabled>
            Simpan (UI Only)
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "not-allowed",
};

export default OwnerSettings;
