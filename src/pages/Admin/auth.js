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
    await supabase.auth.getSession();

  return Boolean(data?.session);

}

export async function getCurrentUser() {

  const { data } =
    await supabase.auth.getUser();

  return data?.user ?? null;

}
