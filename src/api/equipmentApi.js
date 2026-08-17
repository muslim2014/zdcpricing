import { supabase } from "../lib/supabase";

const TABLE = "equipment_sections";

/* =========================
   Equipment Sections
========================= */

export async function getEquipmentSections(onlyVisible = false) {

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

export async function getEquipmentSectionsWithItems() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*, items:equipment_items(*)")
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}

/* ========================= */

export async function getEquipmentSection(id) {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function createEquipmentSection(section) {

  const { data, error } = await supabase
    .from(TABLE)
    .insert([section])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateEquipmentSection(id, updates) {

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

export async function deleteEquipmentSection(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

}

/* ========================= */

export async function toggleEquipmentSectionVisibility(id, visible) {

  return updateEquipmentSection(id, {
    visible
  });

}

/* ========================= */

export async function moveEquipmentSectionUp(id) {

  const current = await getEquipmentSection(id);

  if (!current) return;

  const { data } = await supabase
    .from(TABLE)
    .select("*")
    .lt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: false
    })
    .limit(1);

  if (!data?.length) return;

  await updateEquipmentSection(current.id, {
    sort_order: data[0].sort_order
  });

  await updateEquipmentSection(data[0].id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveEquipmentSectionDown(id) {

  const current = await getEquipmentSection(id);

  if (!current) return;

  const { data } = await supabase
    .from(TABLE)
    .select("*")
    .gt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: true
    })
    .limit(1);

  if (!data?.length) return;

  await updateEquipmentSection(current.id, {
    sort_order: data[0].sort_order
  });

  await updateEquipmentSection(data[0].id, {
    sort_order: current.sort_order
  });

}

/* =========================
   البيانات العامة (Public)
   - الأقسام الظاهرة فقط مرتّبة بـ sort_order
   - داخلها الكروت الظاهرة فقط مرتّبة بـ sort_order
========================= */

export async function getPublicEquipmentSections() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*, items:equipment_items(*)")
    .eq("visible", true)
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return (data || []).map(section => ({
    ...section,
    items: (section.items || [])
      .filter(item => item.visible !== false)
      .sort(
        (a, b) =>
          Number(a.sort_order) - Number(b.sort_order)
      )
  }));

}

/* =========================
   Equipment Items (Cards)
========================= */

const ITEMS_TABLE = "equipment_items";

export async function getEquipmentItems(sectionId) {

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("section_id", sectionId)
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}

/* ========================= */

export async function getEquipmentItem(id) {

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function createEquipmentItem(item) {

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .insert([item])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateEquipmentItem(id, updates) {

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
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

export async function deleteEquipmentItem(id) {

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw error;

  if (!data || data.length === 0) {

    throw new Error(
      "تعذر حذف الكارت: لا تملك صلاحية الحذف أو الكارت غير موجود"
    );

  }

}

/* ========================= */

export async function toggleEquipmentItemVisibility(id, visible) {

  return updateEquipmentItem(id, {
    visible
  });

}

/* ========================= */

export async function moveEquipmentItemUp(id) {

  const current = await getEquipmentItem(id);

  if (!current) return;

  const { data } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("section_id", current.section_id)
    .lt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: false
    })
    .limit(1);

  if (!data?.length) return;

  await updateEquipmentItem(current.id, {
    sort_order: data[0].sort_order
  });

  await updateEquipmentItem(data[0].id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveEquipmentItemDown(id) {

  const current = await getEquipmentItem(id);

  if (!current) return;

  const { data } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("section_id", current.section_id)
    .gt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: true
    })
    .limit(1);

  if (!data?.length) return;

  await updateEquipmentItem(current.id, {
    sort_order: data[0].sort_order
  });

  await updateEquipmentItem(data[0].id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveEquipmentItemToSection(
  id,
  targetSectionId
) {

  const { data: targetItems, error: targetError } =
    await supabase
      .from(ITEMS_TABLE)
      .select("sort_order")
      .eq("section_id", targetSectionId);

  if (targetError) throw targetError;

  const maxSortOrder = targetItems.reduce(
    (max, item) => Math.max(
      max,
      Number(item.sort_order) || 0
    ),
    0
  );

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .update({
      section_id: Number(targetSectionId),
      sort_order: maxSortOrder + 1
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}