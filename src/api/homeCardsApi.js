import { supabase } from "../lib/supabase";

/* ========================= */

export async function getHomeCards(onlyVisible = false) {

  let query = supabase
    .from("home_cards")
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

export async function getHomeCard(id) {

  const { data, error } = await supabase
    .from("home_cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function createHomeCard(card) {

  const { data, error } = await supabase
    .from("home_cards")
    .insert([card])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function updateHomeCard(id, updates) {

  const { data, error } = await supabase
    .from("home_cards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */

export async function deleteHomeCard(id) {

  const { error } = await supabase
    .from("home_cards")
    .delete()
    .eq("id", id);

  if (error) throw error;

}

/* ========================= */

export async function toggleHomeCardVisibility(id, visible) {

  return updateHomeCard(id, {
    visible
  });

}

/* ========================= */

export async function toggleHomeCardFeatured(id, featured) {

  return updateHomeCard(id, {
    featured
  });

}

/* ========================= */

export async function moveHomeCardUp(id) {

  const cards = await getHomeCards();

  const index = cards.findIndex(
    c => Number(c.id) === Number(id)
  );

  if (index <= 0) return;

  const current = cards[index];
  const previous = cards[index - 1];

  await updateHomeCard(current.id, {
    sort_order: previous.sort_order
  });

  await updateHomeCard(previous.id, {
    sort_order: current.sort_order
  });

}

/* ========================= */

export async function moveHomeCardDown(id) {

  const cards = await getHomeCards();

  const index = cards.findIndex(
    c => Number(c.id) === Number(id)
  );

  if (index === -1 || index >= cards.length - 1) return;

  const current = cards[index];
  const next = cards[index + 1];

  await updateHomeCard(current.id, {
    sort_order: next.sort_order
  });

  await updateHomeCard(next.id, {
    sort_order: current.sort_order
  });

}