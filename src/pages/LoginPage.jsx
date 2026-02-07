import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, role, loading, authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 🔑 Redirect setelah auth siap
  useEffect(() => {
    if (loading) return;

    if (user && role === "owner") {
      navigate("/owner/dashboard", { replace: true });
    }

    if (user && role === "kasir") {
      navigate("/dashboard/kasir", { replace: true });
    }
  }, [user, role, loading, navigate]);

  // 🔔 Sinkronkan error dari AuthContext
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // ❗ Redirect & validasi lanjutan ditangani AuthContext
    } catch (err) {
      setError(err.message || "Login gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* ================= SIDEBAR ================= */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>TokoWarungDigital</h2>
        <p style={styles.subtitle}>
          Sistem manajemen toko <br /> retail & grosir
        </p>

        <div style={styles.sidebarFooter}>
          <small>© 2026 TokoWarungDigital</small>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main style={styles.main}>
        <div style={styles.card}>
          <h3 style={{ marginBottom: "8px" }}>Login</h3>
          <p style={styles.cardSubtitle}>
            Masuk ke dashboard Anda
          </p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
  },

  sidebar: {
    width: "280px",
    background: "#1e293b",
    color: "#fff",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
  },

  brand: {
    marginBottom: "8px",
    fontSize: "20px",
    fontWeight: "700",
  },

  subtitle: {
    fontSize: "14px",
    color: "#cbd5f5",
    lineHeight: 1.5,
  },

  sidebarFooter: {
    marginTop: "auto",
    fontSize: "12px",
    color: "#94a3b8",
  },

  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "380px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },

  cardSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "20px",
  },

  label: {
    fontSize: "13px",
    marginBottom: "6px",
    display: "block",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    marginBottom: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
  },
};
