import { supabase } from "../lib/supabase";
import { categories } from "../data/categories";

export async function seedServices() {

  const { count } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  if (count > 0) {
    console.log("Services already seeded.");
    return;
  }

  const { data: dbCategories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name");

  if (categoriesError) {
    console.error(categoriesError);
    return;
  }

  const services = [];

  categories.forEach((category) => {

    const dbCategory = dbCategories.find(
      c => c.name === category.name
    );

    if (!dbCategory) return;

    category.services.forEach((service, index) => {

      services.push({

        category_id: dbCategory.id,

        name: service.name,

        image: service.image,

        price: service.price,

        duration: service.duration,

        description: service.description,

        whatsapp_message: service.whatsappMessage,

        features: service.features,

        featured: service.featured,

        visible: service.visible,

        sort_order: index + 1

      });

    });

  });

  const { error } = await supabase
    .from("services")
    .insert(services);

  if (error) {
    console.error(error);
    return;
  }

  console.log("Services seeded successfully.");

}