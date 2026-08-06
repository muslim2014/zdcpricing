import { supabase } from "../lib/supabase";

const TABLE = "booking_medical_history";

/* =========================
   Seed
========================= */

export const DEFAULT_BOOKING_MEDICAL_HISTORY = [

  { title: "لا يوجد", visible: true, sort_order: 1 },

  { title: "مرض السكري", visible: true, sort_order: 2 },

  { title: "ارتفاع ضغط الدم", visible: true, sort_order: 3 },

  { title: "أمراض القلب", visible: true, sort_order: 4 },

  { title: "سيولة الدم", visible: true, sort_order: 5 },

  { title: "حساسية من الأدوية", visible: true, sort_order: 6 },

  { title: "التهاب كبدي", visible: true, sort_order: 7 },

  { title: "حمل", visible: true, sort_order: 8 },

  { title: "أخرى", visible: true, sort_order: 9 }

];

export async function seedBookingMedicalHistory() {

  const { data: existing, error } = await supabase
    .from(TABLE)
    .select("id")
    .limit(1);

  if (error) throw error;

  if (existing?.length) return;

  const { error: insertError } = await supabase
    .from(TABLE)
    .insert(DEFAULT_BOOKING_MEDICAL_HISTORY);

  if (insertError) throw insertError;

}

/* ========================= */

export async function getBookingMedicalHistory(onlyVisible = false) {

  await seedBookingMedicalHistory();

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

export async function createBookingMedicalHistory(item) {

  const { data, error } = await supabase
    .from(TABLE)
    .insert([item])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateBookingMedicalHistory(id, updates) {

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

export async function deleteBookingMedicalHistory(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

}

/* ========================= */

export async function toggleBookingMedicalHistoryVisibility(id, visible) {

  return updateBookingMedicalHistory(id, {
    visible
  });

}

/* ========================= */

export async function moveBookingMedicalHistoryUp(id) {

  const items = await getBookingMedicalHistory();

  const index = items.findIndex(
    i => Number(i.id) === Number(id)
  );

  if (index <= 0) return;

  const current = items[index];
  const previous = items[index - 1];

  await updateBookingMedicalHistory(current.id, {
    sort_order: previous.sort_order
  });

  await updateBookingMedicalHistory(previous.id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveBookingMedicalHistoryDown(id) {

  const items = await getBookingMedicalHistory();

  const index = items.findIndex(
    i => Number(i.id) === Number(id)
  );

  if (index === -1 || index >= items.length - 1) return;

  const current = items[index];
  const next = items[index + 1];

  await updateBookingMedicalHistory(current.id, {
    sort_order: next.sort_order
  });

  await updateBookingMedicalHistory(next.id, {
    sort_order: current.sort_order
  });

}
