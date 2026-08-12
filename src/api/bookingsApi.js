import { supabase } from "../lib/supabase";

/* =========================
 *   Bookings
 * ========================= */

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) throw error;

  return data;
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function createBooking(booking) {
  const { error } = await supabase
    .from("bookings")
    .insert([booking]);

  if (error) throw error;
}

export async function updateBooking(id, updates) {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteBooking(id) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateBookingStatus(id, status) {
  return updateBooking(id, {
    status
  });
}