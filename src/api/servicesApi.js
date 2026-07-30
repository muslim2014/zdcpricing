import { supabase } from "../lib/supabase";

export async function getServices(categoryId = null, onlyVisible = false) {

  let query = supabase
    .from("services")
    .select("*");

  if (categoryId !== null && categoryId !== undefined) {

    query = query.eq(
      "category_id",
      categoryId
    );

  }

  if (onlyVisible) {

    query = query.eq(
      "visible",
      true
    );

  }

  const { data, error } = await query.order(
    "sort_order",
    {
      ascending: true
    }
  );

  if (error) throw error;

  return data;

}

export async function getService(id) {

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;

}

export async function createService(service) {

  const { data, error } = await supabase
    .from("services")
    .insert([service])
    .select()
    .single();

  if (error) throw error;

  return data;

}

export async function updateService(id, updates) {

  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

export async function deleteService(id) {

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) throw error;

}

export async function toggleServiceVisibility(id, visible) {

  const { data, error } = await supabase
    .from("services")
    .update({
      visible
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

export async function toggleServiceFeatured(id, featured) {

  const { data, error } = await supabase
    .from("services")
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

export async function moveServiceUp(id) {

  const { data: current, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  const { data: previous } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", current.category_id)
    .lt("sort_order", current.sort_order)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (!previous?.length) return;

  await supabase
    .from("services")
    .update({
      sort_order: previous[0].sort_order
    })
    .eq("id", current.id);

  await supabase
    .from("services")
    .update({
      sort_order: current.sort_order
    })
    .eq("id", previous[0].id);

}

/* ========================= */

export async function moveServiceDown(id) {

  const { data: current, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  const { data: next } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", current.category_id)
    .gt("sort_order", current.sort_order)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (!next?.length) return;

  await supabase
    .from("services")
    .update({
      sort_order: next[0].sort_order
    })
    .eq("id", current.id);

  await supabase
    .from("services")
    .update({
      sort_order: current.sort_order
    })
    .eq("id", next[0].id);

}