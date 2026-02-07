import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* HEADER */}
      <header className="header">
        <div className="logo">TokoWarungDigital</div>
        <nav className="nav">
          <a href="#fitur">Fitur</a>
          <a href="#harga">Harga</a>
          <a href="#kontak">Kontak</a>
          <a href="/login" className="btn-masuk">Masuk</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content fade-up">
          <h1>Kelola Toko Lebih Rapi, Tanpa Ribet</h1>
          <p>
            Aplikasi kasir digital untuk UMKM. Catat penjualan, kelola stok,
            dan pantau laporan usaha Anda dari mana saja.
          </p>
          <a href="#harga" className="btn-cta">Lihat Paket</a>
        </div>
      </section>

      {/* FITUR */}
      <section className="features" id="fitur">
        <h2>Dirancang untuk Usaha Kecil yang Ingin Naik Kelas</h2>
        <div className="feature-cards">
          <div className="card fade-up">
            <div className="icon">⚡</div>
            <h3>Transaksi Cepat & Stabil</h3>
            <p>
              Proses transaksi hitungan detik dengan sistem kasir digital
              yang sederhana dan minim kesalahan.
            </p>
          </div>
          <div className="card fade-up">
            <div className="icon">📦</div>
            <h3>Stok Lebih Terkontrol</h3>
            <p>
              Pantau stok produk secara real-time dan hindari kehabisan
              barang tanpa disadari.
            </p>
          </div>
          <div className="card fade-up">
            <div className="icon">📊</div>
            <h3>Laporan Jelas & Mudah Dipahami</h3>
            <p>
              Lihat omzet dan transaksi harian tanpa perlu hitung manual
              atau catatan kertas.
            </p>
          </div>
          <div className="card fade-up">
            <div className="icon">🧩</div>
            <h3>Siap Berkembang</h3>
            <p>
              Mulai dari usaha rumahan hingga multi-kasir tanpa ganti sistem.
            </p>
          </div>
        </div>
      </section>

      {/* HARGA */}
      <section className="pricing" id="harga">
        <h2>Paket Sesuai Tahap Usaha Anda</h2>

        <div className="pricing-cards">
          {/* BASIC */}
          <div className="card fade-up">
            <span className="badge">Paling Hemat</span>
            <h3>Basic</h3>
            <p className="price">Rp25.000 / bulan</p>
            <ul>
              <li>1 Pengguna (Owner merangkap kasir)</li>
              <li>Hingga 500 Produk</li>
              <li>Laporan Penjualan</li>
              <li>Support via Email</li>
            </ul>
            <button>Mulai Basic</button>
          </div>

          {/* STARTER */}
          <div className="card fade-up">
            <h3>Starter</h3>
            <p className="price">Rp50.000 / bulan</p>
            <ul>
              <li>1 Pengguna (Owner merangkap kasir)</li>
              <li>Hingga 500 Produk</li>
              <li>Laporan Penjualan</li>
              <li>Support via Email</li>
            </ul>
            <button>Pilih Starter</button>
          </div>

          {/* BISNIS */}
          <div className="card popular fade-up">
            <span className="badge primary">Paling Populer</span>
            <h3>Bisnis</h3>
            <p className="price">Rp250.000 / bulan</p>
            <ul>
              <li>1 Owner + Hingga 4 Kasir</li>
              <li>Produk Tidak Terbatas</li>
              <li>Analisis Lengkap</li>
              <li>Integrasi WhatsApp</li>
              <li>Support Prioritas</li>
            </ul>
            <button>Pilih Bisnis</button>
          </div>

          {/* ENTERPRISE */}
          <div className="card fade-up">
            <h3>Enterprise</h3>
            <p className="price">Rp500.000 / bulan</p>
            <ul>
              <li>Multi Usaha & Multi Cabang</li>
              <li>Kasir Tidak Terbatas</li>
              <li>API Access</li>
              <li>Dedicated Manager</li>
              <li>Custom Fitur</li>
            </ul>
            <button>Hubungi Sales</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="kontak">
        <p>© 2026 TokoWarungDigital. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
