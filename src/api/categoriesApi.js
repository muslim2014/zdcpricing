import { supabase } from "../lib/supabase";

export async function getCategories(onlyVisible = false) {

  let query = supabase
    .from("categories")
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

export async function createCategory(category) {

  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateCategory(id, updates) {

  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateCategoryImage(id, image) {

  const { data, error } = await supabase
    .from("categories")
    .update({ image })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function deleteCategory(id) {

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;

}

/* ========================= */

export async function toggleCategoryVisibility(id, visible) {

  const { data, error } = await supabase
    .from("categories")
    .update({
      visible
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function toggleCategoryFeatured(id, featured) {

  const { data, error } = await supabase
    .from("categories")
    .update({
      featured
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function moveCategoryUp(id) {

  const categories = await getCategories();

  const index = categories.findIndex(
    c => Number(c.id) === Number(id)
  );

  if (index <= 0) return;

  const current = categories[index];
  const previous = categories[index - 1];

  await updateCategory(current.id, {
    sort_order: previous.sort_order
  });

  await updateCategory(previous.id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveCategoryDown(id) {

  const categories = await getCategories();

  const index = categories.findIndex(
    c => Number(c.id) === Number(id)
  );

  if (index === -1 || index >= categories.length - 1) return;

  const current = categories[index];
  const next = categories[index + 1];

  await updateCategory(current.id, {
    sort_order: next.sort_order
  });

  await updateCategory(next.id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function testCategories() {

  const categories = await getCategories();

  console.log(categories);

}