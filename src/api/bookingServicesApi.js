import { supabase } from "../lib/supabase";

const TABLE = "booking_services";

/* =========================
   Seed
========================= */

export const DEFAULT_BOOKING_SERVICES = [

  { title: "حشو الأسنان", visible: true, sort_order: 1 },

  { title: "تنظيف الأسنان", visible: true, sort_order: 2 },

  { title: "خلع الأسنان", visible: true, sort_order: 3 },

  { title: "تركيب الأسنان", visible: true, sort_order: 4 },

  { title: "تبييض الأسنان", visible: true, sort_order: 5 },

  { title: "تقويم الأسنان", visible: true, sort_order: 6 }

];

export async function seedBookingServices() {

  const { data: existing, error } = await supabase
    .from(TABLE)
    .select("id")
    .limit(1);

  if (error) throw error;

  if (existing?.length) return;

  const { error: insertError } = await supabase
    .from(TABLE)
    .insert(DEFAULT_BOOKING_SERVICES);

  if (insertError) throw insertError;

}

/* ========================= */

export async function getBookingServices(onlyVisible = false) {

  let query = supabase
    .from(TABLE)
    .select("*");

  if (onlyVisible) {

    query = query.eq("visible", true);

  }

  const { data, error } = await query.order(
    "sort_order",
    { ascending: true }
  );

  if (error) throw error;

  return data;

}

/* ========================= */

export async function createBookingService(service) {

  const { data, error } = await supabase
    .from(TABLE)
    .insert([service])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateBookingService(id, updates) {

  const { data, error } = await supabase
    .from(TABLE)
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

/* ========================= */

export async function deleteBookingService(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

}

/* ========================= */

export async function toggleBookingServiceVisibility(id, visible) {

  return updateBookingService(id, {
    visible
  });

}

/* ========================= */

export async function moveBookingServiceUp(id) {

  const services = await getBookingServices();

  const index = services.findIndex(
    s => Number(s.id) === Number(id)
  );

  if (index <= 0) return;

  const current = services[index];
  const previous = services[index - 1];

  await updateBookingService(current.id, {
    sort_order: previous.sort_order
  });

  await updateBookingService(previous.id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveBookingServiceDown(id) {

  const services = await getBookingServices();

  const index = services.findIndex(
    s => Number(s.id) === Number(id)
  );

  if (index === -1 || index >= services.length - 1) return;

  const current = services[index];
  const next = services[index + 1];

  await updateBookingService(current.id, {
    sort_order: next.sort_order
  });

  await updateBookingService(next.id, {
    sort_order: current.sort_order
  });

}
