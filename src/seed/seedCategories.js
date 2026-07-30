import { supabase } from "../lib/supabase";
import { categories } from "../data/categories";

export async function seedCategories() {

  const { count, error: countError } = await supabase
    .from("categories")
    .select("*", {
      count: "exact",
      head: true
    });

  if (countError) {
    console.error(countError);
    return;
  }

  if (count > 0) {
    console.log("Categories already seeded.");
    return;
  }

  console.log("Seeding categories...");

  const data = categories.map((category, index) => ({
    name: category.name,
    image: category.image,
    featured: category.featured,
    sort_order: index + 1
  }));

  const { error } = await supabase
    .from("categories")
    .insert(data);

  if (error) {
    console.error(error);
    return;
  }

  console.log("Categories seeded successfully.");

}