import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSession = async (session) => {
      setAuthError(null);

      // ================= NO SESSION =================
      if (!session?.user) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const authUser = session.user;
      setUser(authUser);

      // ================= GET PROFILE =================
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, expired_at")
        .eq("id", authUser.id)
        .single();

      if (profileError || !profile?.role) {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        setAuthError("Akun tidak memiliki akses yang valid.");
        setLoading(false);
        return;
      }

      // ================= OWNER =================
      if (profile.role === "owner") {
        // OWNER tetap boleh login walaupun expired
        setRole("owner");
        setLoading(false);
        return;
      }

      // ================= KASIR =================
      if (profile.role === "kasir") {
        // ⛔ BLOK JIKA LANGGANAN EXPIRED
        if (
          profile.expired_at &&
          new Date(profile.expired_at) < new Date()
        ) {
          await supabase.auth.signOut();
          setUser(null);
          setRole(null);
          setAuthError(
            "Langganan usaha telah berakhir. Hubungi owner."
          );
          setLoading(false);
          return;
        }

        // 🔍 CEK DATA KASIR
        const { data: kasir, error: kasirError } = await supabase
          .from("kasir")
          .select("status")
          .eq("auth_user_id", authUser.id)
          .single();

        if (kasirError || !kasir) {
          await supabase.auth.signOut();
          setUser(null);
          setRole(null);
          setAuthError("Akun kasir tidak terdaftar.");
          setLoading(false);
          return;
        }

        if (kasir.status !== "ACTIVE") {
          await supabase.auth.signOut();
          setUser(null);
          setRole(null);
          setAuthError("Akun kasir dinonaktifkan oleh owner.");
          setLoading(false);
          return;
        }

        // ✅ KASIR AKTIF & LANGGANAN VALID
        setRole("kasir");
        setLoading(false);
        return;
      }

      // ================= ROLE LAIN =================
      setRole(profile.role);
      setLoading(false);
    };

    // ================= AUTH LISTENER =================
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoading(true);
        handleSession(session);
      }
    );

    // ================= INITIAL SESSION =================
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, loading, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
