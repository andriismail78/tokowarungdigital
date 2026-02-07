import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";

/* DASHBOARD */
import DashboardOwner from "./pages/DashboardOwner";
import DashboardKasir from "./pages/DashboardKasir";
import DashboardSuperadmin from "./pages/DashboardSuperadmin";
import DashboardMarketing from "./pages/DashboardMarketing";
import DashboardSubmarketing from "./pages/DashboardSubmarketing";

/* OWNER PAGES */
import OwnerTransaksi from "./pages/OwnerTransaksi";
import OwnerStok from "./pages/OwnerStok";
import OwnerLaporan from "./pages/OwnerLaporan";
import OwnerPengaturan from "./pages/OwnerPengaturan";

/* KASIR PAGES */
import HistoryTransaksi from "./pages/HistoryTransaksi";

/* OTHER */
import ProductPage from "./pages/ProductPage";
import OwnerLayout from "./layouts/OwnerLayout";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ================= OWNER ================= */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardOwner />} />
        <Route path="produk" element={<ProductPage />} />
        <Route path="transaksi" element={<OwnerTransaksi />} />
        <Route path="stok" element={<OwnerStok />} />
        <Route path="laporan" element={<OwnerLaporan />} />
        <Route path="pengaturan" element={<OwnerPengaturan />} />
      </Route>

      {/* ================= KASIR ================= */}
      <Route
        path="/dashboard/kasir"
        element={
          <ProtectedRoute allowedRoles={["kasir", "owner"]}>
            <DashboardKasir />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/kasir/history"
        element={
          <ProtectedRoute allowedRoles={["kasir", "owner"]}>
            <HistoryTransaksi />
          </ProtectedRoute>
        }
      />

      {/* ================= SUPERADMIN ================= */}
      <Route
        path="/dashboard/superadmin"
        element={
          <ProtectedRoute allowedRoles={["superadmin"]}>
            <DashboardSuperadmin />
          </ProtectedRoute>
        }
      />

      {/* ================= MARKETING ================= */}
      <Route
        path="/dashboard/marketing"
        element={
          <ProtectedRoute allowedRoles={["marketing"]}>
            <DashboardMarketing />
          </ProtectedRoute>
        }
      />

      {/* ================= SUB MARKETING ================= */}
      <Route
        path="/dashboard/submarketing"
        element={
          <ProtectedRoute allowedRoles={["submarketing"]}>
            <DashboardSubmarketing />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
