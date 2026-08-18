import { supabase } from "../lib/supabase";

const TABLE = "booking_fields";

/* =========================
   Seed
========================= */

export const DEFAULT_BOOKING_FIELDS = [

  {
    field_key: "name",
    title: "الاسم",
    type: "text",
    visible: true,
    required: true,
    sort_order: 1,
    options: [],
    data_source: "manual"
  },

  {
    field_key: "phone",
    title: "رقم الهاتف",
    type: "text",
    visible: true,
    required: true,
    sort_order: 2,
    options: [],
    data_source: "manual"
  },

  {
    field_key: "age",
    title: "العمر",
    type: "number",
    visible: true,
    required: false,
    sort_order: 3,
    options: [],
    data_source: "manual"
  },

  {
    field_key: "medical_history",
    title: "التاريخ المرضي",
    type: "multiselect",
    visible: true,
    required: false,
    sort_order: 4,
    options: [
      "لا يوجد",
      "مرض السكري",
      "ارتفاع ضغط الدم",
      "أمراض القلب",
      "سيولة الدم",
      "حساسية من الأدوية",
      "التهاب كبدي",
      "حمل",
      "أخرى"
    ],
    data_source: "manual"
  },

  {
    field_key: "notes",
    title: "ملاحظات",
    type: "textarea",
    visible: true,
    required: false,
    sort_order: 5,
    options: [],
    data_source: "manual"
  },

  {
    field_key: "service",
    title: "الخدمة",
    type: "select",
    visible: true,
    required: true,
    sort_order: 6,
    options: [],
    data_source: "services"
  },

  {
    field_key: "date",
    title: "التاريخ المفضل",
    type: "date",
    visible: true,
    required: true,
    sort_order: 7,
    options: [],
    data_source: "manual"
  },

  {
    field_key: "time",
    title: "الوقت المفضل",
    type: "time",
    visible: true,
    required: true,
    sort_order: 8,
    options: [],
    data_source: "manual"
  }

];

export async function seedBookingFields() {

  const { data: existing, error } = await supabase
    .from(TABLE)
    .select("id")
    .limit(1);

  if (error) throw error;

  if (existing?.length) return;

  const { error: insertError } = await supabase
    .from(TABLE)
    .insert(DEFAULT_BOOKING_FIELDS);

  if (insertError) throw insertError;

}

/* ========================= */

export async function getBookingFields() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}

/* ========================= */

export async function createBookingField(field) {

  const { data, error } = await supabase
    .from(TABLE)
    .insert([field])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateBookingField(id, updates) {

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

export async function deleteBookingField(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

}

/* ========================= */

export async function moveBookingFieldUp(id) {

  const fields = await getBookingFields();

  const index = fields.findIndex(
    f => Number(f.id) === Number(id)
  );

  if (index <= 0) return;

  const current = fields[index];
  const previous = fields[index - 1];

  await updateBookingField(current.id, {
    sort_order: previous.sort_order
  });

  await updateBookingField(previous.id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveBookingFieldDown(id) {

  const fields = await getBookingFields();

  const index = fields.findIndex(
    f => Number(f.id) === Number(id)
  );

  if (index === -1 || index >= fields.length - 1) return;

  const current = fields[index];
  const next = fields[index + 1];

  await updateBookingField(current.id, {
    sort_order: next.sort_order
  });

  await updateBookingField(next.id, {
    sort_order: current.sort_order
  });

}
