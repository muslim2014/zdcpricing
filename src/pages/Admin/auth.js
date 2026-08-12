import { supabase } from "../../lib/supabase";

export async function login(email, password) {

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  return !error;

}

export async function logout() {

  await supabase.auth.signOut();

}

export async function isLoggedIn() {

  const { data } =
    await supabase.auth.getUser();

  return Boolean(data?.user);

}

export async function getCurrentUser() {

  const { data } =
    await supabase.auth.getUser();

  return data?.user ?? null;

}

/* =========================
   بعد SIGNED_OUT: إزالة أي أزرار حذف خدمة قد تكون مُرسومة
   في الصفحة العامة حتى لا تظهر أدوات Admin لمستخدم غير صالح.
   لا يغيّر سلوك الـ UI في أي اتجاه آخر.
========================= */

if (typeof window !== "undefined") {

  supabase.auth.onAuthStateChange((event) => {

    if (event === "SIGNED_OUT") {

      document
        .querySelectorAll(".service-delete-btn")
        .forEach(btn => btn.remove());

    }

  });

}
