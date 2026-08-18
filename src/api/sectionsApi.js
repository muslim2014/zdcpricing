import { supabase } from "../lib/supabase";

/* ========================= */

export async function getSections(page) {

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("page", page)
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}

/* ========================= */

export async function getSection(id) {

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function createSection(section) {

  const { data, error } = await supabase
    .from("sections")
    .insert([section])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateSection(id, updates) {

  const { error } = await supabase
    .from("sections")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) throw error;

  return await getSection(id);

}

/* ========================= */

export async function saveSection(id, updates) {

  return updateSection(id, updates);

}

/* ========================= */

export async function toggleSectionVisibility(id, visible) {

  return updateSection(id, {
    visible
  });

}

/* ========================= */

export async function toggleSectionFeatured(id, featured) {

  return updateSection(id, {
    featured
  });

}

/* ========================= */

export async function moveSectionUp(id) {

  const current = await getSection(id);

  if (!current) return;

  const { data } = await supabase
    .from("sections")
    .select("*")
    .eq("page", current.page)
    .lt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: false
    })
    .limit(1);

  if (!data?.length) return;

  await updateSection(current.id, {
    sort_order: data[0].sort_order
  });

  await updateSection(data[0].id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveSectionDown(id) {

  const current = await getSection(id);

  if (!current) return;

  const { data } = await supabase
    .from("sections")
    .select("*")
    .eq("page", current.page)
    .gt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: true
    })
    .limit(1);

  if (!data?.length) return;

  await updateSection(current.id, {
    sort_order: data[0].sort_order
  });

  await updateSection(data[0].id, {
    sort_order: current.sort_order
  });

}