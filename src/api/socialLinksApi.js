import { supabase } from "../lib/supabase";

/* =========================
   Get All
========================= */

export async function getSocialLinks() {

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}

/* =========================
   Get One
========================= */

export async function getSocialLink(id) {

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;

}

/* =========================
   Update
========================= */

export async function updateSocialLink(id, updates) {

  const { data, error } = await supabase
    .from("social_links")
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

/* =========================
   Toggle Visibility
========================= */

export async function toggleSocialVisibility(
  id,
  visible
) {

  return updateSocialLink(id, {
    visible
  });

}

/* =========================
   Move Up
========================= */

export async function moveSocialUp(id) {

  const { data: current, error } =
    await supabase
      .from("social_links")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  const { data: previous } =
    await supabase
      .from("social_links")
      .select("*")
      .lt(
        "sort_order",
        current.sort_order
      )
      .order(
        "sort_order",
        {
          ascending: false
        }
      )
      .limit(1);

  if (!previous?.length) return;

  await supabase
    .from("social_links")
    .update({
      sort_order:
        previous[0].sort_order
    })
    .eq("id", current.id);

  await supabase
    .from("social_links")
    .update({
      sort_order:
        current.sort_order
    })
    .eq("id", previous[0].id);

}

/* =========================
   Move Down
========================= */

export async function moveSocialDown(id) {

  const { data: current, error } =
    await supabase
      .from("social_links")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  const { data: next } =
    await supabase
      .from("social_links")
      .select("*")
      .gt(
        "sort_order",
        current.sort_order
      )
      .order(
        "sort_order",
        {
          ascending: true
        }
      )
      .limit(1);

  if (!next?.length) return;

  await supabase
    .from("social_links")
    .update({
      sort_order:
        next[0].sort_order
    })
    .eq("id", current.id);

  await supabase
    .from("social_links")
    .update({
      sort_order:
        current.sort_order
    })
    .eq("id", next[0].id);

}

export async function getVisibleSocialLinks() {

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("visible", true)
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}