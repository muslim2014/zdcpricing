
import { supabase } from "../lib/supabase";

export async function getCategoriesFromDB() {

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data;

}

export async function addCategoryToDB(category) {

  const { error } = await supabase
    .from("categories")
    .insert(category);

  if (error) throw error;

}

export async function updateCategoryInDB(id, category) {

  const { error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id);

  if (error) throw error;

}

export async function deleteCategoryFromDB(id) {

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;

}
export async function testCategories() {

  const { data, error } = await supabase
    .from("categories")
    .select("*");

  console.log("Categories:", data);

  if (error) {
    console.error(error);
  }

}