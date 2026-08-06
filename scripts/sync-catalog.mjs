import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { categories } from "../src/data/categories.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const needsConfirm = !process.argv.includes("--yes");

const envPath = join(__dirname, "..", ".env");
const raw = readFileSync(envPath, "utf8");

function getVar(name) {
  const line = raw.split(/\r?\n/).find((l) => l.trim().startsWith(name + "="));
  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

const url = getVar("VITE_SUPABASE_URL");
const anonKey = getVar("VITE_SUPABASE_ANON_KEY");

if (!url || !anonKey) {
  console.error("ERROR: missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const EXPECTED_CATEGORIES = categories.length;
const EXPECTED_SERVICES = categories.reduce((n, c) => n + c.services.length, 0);

console.log("Expected: " + EXPECTED_CATEGORIES + " categories, " + EXPECTED_SERVICES + " services");

async function countFrom(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count;
}

async function alreadySynced() {
  try {
    const catCount = await countFrom("categories");
    const servCount = await countFrom("services");
    if (catCount !== EXPECTED_CATEGORIES || servCount !== EXPECTED_SERVICES) {
      return false;
    }
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .order("sort_order");
    if (error) throw error;
    const names = data.map((c) => c.name);
    const expected = categories.map((c) => c.name);
    return JSON.stringify(names) === JSON.stringify(expected);
  } catch {
    return false;
  }
}

if (await alreadySynced()) {
  console.log("Already synced. Nothing to do.");
  process.exit(0);
}

if (needsConfirm) {
  console.log("");
  console.log("This will DELETE all rows in 'services' and 'categories',");
  console.log("then insert " + EXPECTED_CATEGORIES + " categories and " + EXPECTED_SERVICES + " services.");
  console.log("Run again with --yes to execute.");
  process.exit(0);
}

const step = (msg) => console.log("\n>> " + msg);

step("Deleting all services...");
const { error: delServError } = await supabase.from("services").delete().gte("id", 0);
if (delServError) {
  console.error("DELETE services failed:", delServError.message);
  process.exit(1);
}

step("Deleting all categories...");
const { error: delCatError } = await supabase.from("categories").delete().gte("id", 0);
if (delCatError) {
  console.error("DELETE categories failed:", delCatError.message);
  process.exit(1);
}

step("Inserting categories...");
const { data: insertedCategories, error: insCatError } = await supabase
  .from("categories")
  .insert(
    categories.map((category, index) => ({
      name: category.name,
      image: category.image,
      featured: category.featured,
      visible: true,
      sort_order: index + 1
    }))
  )
  .select("id, name");
if (insCatError) {
  console.error("INSERT categories failed:", insCatError.message);
  process.exit(1);
}

const categoryIdByName = {};
insertedCategories.forEach((c) => {
  categoryIdByName[c.name] = c.id;
});

step("Inserting services...");
const services = [];
categories.forEach((category) => {
  const categoryId = categoryIdByName[category.name];
  if (!categoryId) {
    console.error("Missing category id for: " + category.name);
    process.exit(1);
  }
  category.services.forEach((service, index) => {
    services.push({
      category_id: categoryId,
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

const { error: insServError } = await supabase.from("services").insert(services);
if (insServError) {
  console.error("INSERT services failed:", insServError.message);
  process.exit(1);
}

const finalCat = await countFrom("categories");
const finalServ = await countFrom("services");

console.log("");
console.log("Done.");
console.log("Categories in DB: " + finalCat + " / " + EXPECTED_CATEGORIES);
console.log("Services in DB: " + finalServ + " / " + EXPECTED_SERVICES);

if (finalCat !== EXPECTED_CATEGORIES || finalServ !== EXPECTED_SERVICES) {
  console.log("WARNING: counts differ from expected.");
  process.exit(1);
}
