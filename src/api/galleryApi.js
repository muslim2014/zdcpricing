import { supabase } from "../lib/supabase";

import {
  deleteImageByUrl
} from "../lib/storage";

/* =========================
   Gallery
========================= */

export async function getGallery() {

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}

export async function getGalleryImage(id) {

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;

}

export async function createGalleryImage(image) {

  const { data, error } = await supabase
    .from("gallery")
    .insert([image])
    .select()
    .single();

  if (error) throw error;

  return data;

}

export async function updateGalleryImage(id, updates) {

  const { data, error } = await supabase
    .from("gallery")
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

export async function deleteGalleryImage(id) {

  const image = await getGalleryImage(id);

  if (image?.image) {

    await deleteImageByUrl(image.image);

  }

  const { error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) throw error;

}

export async function toggleGalleryVisibility(id, visible) {

  return updateGalleryImage(id, {
    visible
  });

}

export async function moveGalleryUp(id) {

  const current = await getGalleryImage(id);

  if (!current) {

    throw new Error("الصورة غير موجودة");

  }

  const { data: previous, error } = await supabase
    .from("gallery")
    .select("*")
    .lt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: false
    })
    .limit(1);

  if (error) throw error;

  if (!previous.length) return;

  await updateGalleryImage(current.id, {
    sort_order: previous[0].sort_order
  });

  await updateGalleryImage(previous[0].id, {
    sort_order: current.sort_order
  });

}

export async function moveGalleryDown(id) {

  const current = await getGalleryImage(id);

  if (!current) {

    throw new Error("الصورة غير موجودة");

  }

  const { data: next, error } = await supabase
    .from("gallery")
    .select("*")
    .gt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: true
    })
    .limit(1);

  if (error) throw error;

  if (!next.length) return;

  await updateGalleryImage(current.id, {
    sort_order: next[0].sort_order
  });

  await updateGalleryImage(next[0].id, {
    sort_order: current.sort_order
  });

}