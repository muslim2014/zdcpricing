import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

/*
 * RECOVERY: استعادة src/data/categories.js من قاعدة البيانات (52 خدمة)
 * لأن نسخة الـ 52 غير الملتزمة في git فقدت أثناء عمل التحرير.
 * يعيد بناء الملف بنفس البنية الأصلية (description موحّد قديم كما كان).
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");
const raw = readFileSync(envPath, "utf8");

function getVar(name) {
  const line = raw.split(/\r?\n/).find((l) => l.trim().startsWith(name + "="));
  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

const supabase = createClient(getVar("VITE_SUPABASE_URL"), getVar("VITE_SUPABASE_ANON_KEY"));

const { data: cats, error: catErr } = await supabase
  .from("categories")
  .select("id, name, image, featured, sort_order")
  .order("sort_order");

if (catErr) throw new Error(catErr.message);

const { data: svcs, error: svcErr } = await supabase
  .from("services")
  .select("id, category_id, name, price, image, duration, description, whatsapp_message, features, featured, visible, sort_order")
  .order("sort_order");

if (svcErr) throw new Error(svcErr.message);

const byCategory = {};
for (const s of svcs) {
  if (!byCategory[s.category_id]) byCategory[s.category_id] = [];
  byCategory[s.category_id].push(s);
}

const lines = [];
lines.push("export const categories = [");

cats.forEach((c) => {
  const cServices = (byCategory[c.id] || []).sort((a, b) => a.sort_order - b.sort_order);
  lines.push(" {");
  lines.push(`  id: ${c.id},`);
  lines.push(`  name: "${c.name}",`);
  lines.push(`  image: ${JSON.stringify(c.image || "")},`);
  lines.push(`  featured: ${c.featured},`);
  lines.push("");
  lines.push("  services: [");
  cServices.forEach((s, i) => {
    const comma = i < cServices.length - 1 ? "," : "";
    lines.push("    {");
    lines.push(`      id: ${s.id},`);
    lines.push(`      name: ${JSON.stringify(s.name)},`);
    lines.push(`      price: ${JSON.stringify(s.price || "")},`);
    lines.push(`      image: ${JSON.stringify(s.image || "")},`);
    lines.push(`      duration: ${JSON.stringify(s.duration || "")},`);
    lines.push("      description: " + JSON.stringify(s.description || "") + comma);
    lines.push(`      features: ${JSON.stringify(s.features || [])},`);
    lines.push(`      whatsappMessage: ${JSON.stringify(s.whatsapp_message || "")},`);
    lines.push(`      featured: ${s.featured},`);
    lines.push(`      visible: ${s.visible}`);
    lines.push("    }");
  });
  lines.push("  ]");
  lines.push(" },");
});

lines.push("];");
lines.push("");

writeFileSync(join(__dirname, "..", "src", "data", "categories.js"), lines.join("\n"), "utf8");

console.log("Recovered: " + cats.length + " categories, " + svcs.length + " services");
